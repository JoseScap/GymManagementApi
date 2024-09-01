import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionsRequest } from './dto/request/create-subscriptions.request';
import { UpdateSubscriptionsRequest } from './dto/request/update-subscriptions.request';
import { Subscription } from './entities/subscription.entity';
import { DataSource, LessThan, QueryRunner, Repository } from 'typeorm';
import { PER_PAGE, WEEK_STARTS_ON } from 'src/common/constants';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { RemoveRestoreSubscriptionsOptions } from './dto/service/remove-restore.dto';
import { Member } from 'src/members/entities/member.entity';
import { ActiveMemberStatus, MemberStatus } from 'src/members/enums/member.enum';
import { Summary } from 'src/summaries/entities/summary.entity';
import { getDate, getMonth, getWeek, getYear } from 'date-fns';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindPaginatedOptions } from './types/service-options';
import { GroupedSubSummary } from 'src/summaries/entities/grouped_sub_summary.view';
import { GroupedGgccSummary } from 'src/summaries/entities/grouped_ggcc_summary.view';
import { SubscriptionSummary } from 'src/summaries/entities/subscription_summary.view';
import { GymClass } from 'src/gym-class/entities/gym-class.entity';

@Injectable()
export class SubscriptionsService {

  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
    @InjectRepository(SubscriptionSummary)
    private subSummaryRepository: Repository<SubscriptionSummary>,
    @InjectRepository(GymClass)
    private ggccRepository: Repository<GymClass>,
    private dataSource: DataSource,
  ) { }

  async create(request: CreateSubscriptionsRequest) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    let result: string = null;

    // Iniciar la transacción
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const member = await this.memberRepository.findOne({ where: { id: request.memberId } })
    
      if (!member) {
        throw new NotFoundException(`Member with ID ${request.memberId} not found`);
      }

      const subscription = this.subscriptionRepository.create(request);
      await queryRunner.manager.save(subscription)

      member.currentStatus = request.status === ActiveMemberStatus.Día
        ? MemberStatus.Día
        : request.status === ActiveMemberStatus.Semana
        ? MemberStatus.Semana
        : MemberStatus.Mes

      await queryRunner.manager.save(member)
      // Confirmar la transacción
      await queryRunner.commitTransaction();
      result = subscription.id
    } catch (error) {
      // Si ocurre un error, revertir la transacción
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }

    return result
  }

  async findPaginated({ page, dateFrom, dateTo, dni, fullname}: FindPaginatedOptions): Promise<PaginatedApiResponse<Subscription>> {
    let data: Subscription[]
    if (!(page < 1)) page = 1

    // Contamos cuantos subscriptions hay

    let countQuery = this.subscriptionRepository
    .createQueryBuilder('ggcc')
    .leftJoinAndSelect('ggcc.member', 'member')

    if (dni) {
      countQuery = countQuery.andWhere('LOWER(member.dni) LIKE LOWER(:dni)', { dni: `%${dni}%` });
    }

    if (fullname) {
      countQuery = countQuery.andWhere('LOWER(member.fullname) LIKE LOWER(:fullname)', { fullname: `%${fullname}%` });
    }
    
    if (dateFrom && dateTo) {
      countQuery = countQuery.andWhere('ggcc.dateFrom >= :dateFrom AND ggcc.dateTo <= :dateTo', { dateFrom, dateTo });
    }

    const items = await countQuery.getCount();

    // Calculamos la primer pagina y si existe anterior
    const first = items > 0 ? 1 : 0
    const prev: number | null = page === 1 || first === 0 ? null : page - 1;

    // Calculamos la ultima y si existe una siguiente
    const last = Math.ceil(items / PER_PAGE);
    const next: number | null = page >= last ? null : page + 1;

    // La cantidad de paginas coincide con la ultima
    const pages = last;

    let dataQuery = this.subscriptionRepository
      .createQueryBuilder('ggcc')
      .leftJoinAndSelect('ggcc.member', 'member')

    if (dni) {
      dataQuery = dataQuery.andWhere('LOWER(member.dni) LIKE LOWER(:dni)', { dni: `%${dni}%` });
    }

    if (fullname) {
      dataQuery = dataQuery.andWhere('LOWER(member.fullname) LIKE LOWER(:fullname)', { fullname: `%${fullname}%` });
    }

    if (dateFrom && dateTo) {
      dataQuery = dataQuery.andWhere('ggcc.dateFrom >= :dateFrom AND ggcc.dateTo <= :dateTo', { dateFrom, dateTo });
    }

    dataQuery = dataQuery.orderBy('ggcc.createdAt', 'DESC')
      .skip((page - 1) * PER_PAGE)
      .take(PER_PAGE);

    data = await dataQuery.getMany();

    return {
      first,
      prev,
      next,
      last,
      pages,
      items,
      data
    }
  }

  async findOne(id: string, embedMember: boolean): Promise<Subscription> {
    let subscription: Subscription;

    subscription = await this.subscriptionRepository.findOne({ where: { id }, relations: { member: embedMember } })

    if (!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    return subscription
  }

  async getSign(date: Date) {
    const newSubs = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count = 1')
        .andWhere('ss.isCanceled = 0')
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const newCashSubs = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count = 1')
        .andWhere('ss.isCanceled = 0')
        .andWhere("ss.paymentMethod = 'Efectivo'")
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const newTransferSubs = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count = 1')
        .andWhere('ss.isCanceled = 0')
        .andWhere("ss.paymentMethod = 'Transferencia'")
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const newCanceledSubs = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count = 1')
        .andWhere('ss.isCanceled = 1')
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const newCanceledCashSubs = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count = 1')
        .andWhere('ss.isCanceled = 1')
        .andWhere("ss.paymentMethod = 'Efectivo'")
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const newCanceledTransferSubs = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count = 1')
        .andWhere('ss.isCanceled = 1')
        .andWhere("ss.paymentMethod = 'Transferencia'")
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const renewals = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count > 1')
        .andWhere('ss.isCanceled = 0')
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const cashRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count > 1')
        .andWhere('ss.isCanceled = 0')
        .andWhere("ss.paymentMethod = 'Efectivo'")
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const transferRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count > 1')
        .andWhere('ss.isCanceled = 0')
        .andWhere("ss.paymentMethod = 'Transferencia'")
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();
    
    const canceledRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count > 1')
        .andWhere('ss.isCanceled = 1')
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const canceledCashRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count > 1')
        .andWhere('ss.isCanceled = 1')
        .andWhere("ss.paymentMethod = 'Efectivo'")
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const canceledTransferRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
        .select('DATE(ss.createdAt)', 'date')
        .addSelect('SUM(ss.amount)', 'totalAmount')
        .addSelect('COUNT(ss.id)', 'count')
        .where('ss.previous_count > 1')
        .andWhere('ss.isCanceled = 1')
        .andWhere("ss.paymentMethod = 'Transferencia'")
        .andWhere('DATE(ss.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ss.createdAt)')
        .getRawMany<GroupedSubSummary>();

    const gymClasses = await this.ggccRepository.createQueryBuilder('ggcc')
        .select('DATE(ggcc.createdAt)', 'date')
        .addSelect('SUM(ggcc.total)', 'total')
        .addSelect('SUM(ggcc.transferTotal)', 'transferTotal')
        .addSelect('COUNT(ggcc.id)', 'count')
        .where('ggcc.isCanceled = 0')
        .andWhere('DATE(ggcc.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ggcc.createdAt)')
        .getRawMany<GroupedGgccSummary>()

    const canceledGymClasses = await this.ggccRepository.createQueryBuilder('ggcc')
        .select('DATE(ggcc.createdAt)', 'date')
        .addSelect('SUM(ggcc.total)', 'total')
        .addSelect('COUNT(ggcc.id)', 'count')
        .addSelect('SUM(ggcc.transferTotal)', 'transferTotal')
        .where('ggcc.isCanceled = 1')
        .andWhere('DATE(ggcc.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ggcc.createdAt)')
        .getRawMany<GroupedGgccSummary>()

    // Cash totals
    const newSubsCashTotal = +(newCashSubs[0]?.totalAmount ?? 0)
    const renewalsCashTotal = +(cashRenewals[0]?.totalAmount ?? 0)
    const gymClassesCashTotal = +(gymClasses[0]?.total ?? 0) - (+(gymClasses[0]?.transferTotal ?? 0))
    const totalCashIncome = newSubsCashTotal + renewalsCashTotal + gymClassesCashTotal

    // Transfer totals
    const newSubsTransferTotal = +(newTransferSubs[0]?.totalAmount ?? 0)
    const renewalsTransferTotal = +(transferRenewals[0]?.totalAmount ?? 0)
    const gymClassesTransferTotal = +(gymClasses[0]?.transferTotal ?? 0)
    const totalTransferIncome = newSubsTransferTotal + renewalsTransferTotal + gymClassesTransferTotal

    const totalIncome = (+(newSubs[0]?.totalAmount ?? 0)) + (+(renewals[0]?.totalAmount ?? 0)) + (+(gymClasses[0]?.total ?? 0))

    return {
        newMembersCount: +(newSubs[0]?.count ?? 0),
        newMembersIncome: +(newSubs[0]?.totalAmount ?? 0),
        newMembersCashIncome: +(newCashSubs[0]?.totalAmount ?? 0),
        newMembersTransferIncome: +(newTransferSubs[0]?.totalAmount ?? 0),
        newMembersCanceledCount: +(newCanceledSubs[0]?.count ?? 0),
        newMembersCanceledIncome: +(newCanceledSubs[0]?.totalAmount ?? 0),
        newMembersCanceledCashIncome: +(newCanceledCashSubs[0]?.totalAmount ?? 0),
        newMembersCanceledTransferIncome: +(newCanceledTransferSubs[0]?.totalAmount ?? 0),
        renewedMembersCount: +(renewals[0]?.count ?? 0),
        renewedMembersIncome: +(renewals[0]?.totalAmount ?? 0),
        renewedMembersCashIncome: +(cashRenewals[0]?.totalAmount ?? 0),
        renewedMembersTransferIncome: +(transferRenewals[0]?.totalAmount ?? 0),
        renewedMembersCanceledCount: +(canceledRenewals[0]?.count ?? 0),
        renewedMembersCanceledIncome: +(canceledRenewals[0]?.totalAmount ?? 0),
        renewedMembersCanceledCashIncome: +(canceledCashRenewals[0]?.totalAmount ?? 0),
        renewedMembersCanceledTransferIncome: +(canceledTransferRenewals[0]?.totalAmount ?? 0),
        gymClassesCount: +(gymClasses[0]?.count ?? 0),
        gymClassesIncome: +(gymClasses[0]?.total ?? 0),
        gymClassesCashIncome: +(gymClasses[0]?.total ?? 0) - (+(gymClasses[0]?.transferTotal ?? 0)),
        gymClassesTransferIncome: +(gymClasses[0]?.transferTotal ?? 0),
        gymClassesCanceledCount: +(canceledGymClasses[0]?.count ?? 0),
        gymClassesCanceledIncome: +(canceledGymClasses[0]?.total ?? 0),
        gymClassesCanceledCashIncome: +(canceledGymClasses[0]?.total ?? 0) - (+(canceledGymClasses[0]?.transferTotal ?? 0)),
        gymClassesCanceledTransferIncome: +(canceledGymClasses[0]?.transferTotal ?? 0),
        totalIncome,
        totalCashIncome,
        totalTransferIncome
    };
  }

  async update(id: string, updateSubscriptionsDto: UpdateSubscriptionsRequest): Promise<void> {
    const subscription = await this.subscriptionRepository.findOneBy({ id });

    if (!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    // Buscamos el resumen (summary) correspondiente a la fecha de creación de la suscripción
    const summary = await this.summaryRepository.findOne({
      where: {
        day: getDate(subscription.createdAt),
        month: getMonth(subscription.createdAt) + 1,
        year: getYear(subscription.createdAt),
      },
    });
  
    // Si no existe un summary, solo actualizamos la suscripción y salimos
    await this.subscriptionRepository.update(subscription, updateSubscriptionsDto);
    if (!summary) {
      return;
    }
    
    try {
      const newSign = await this.getSign(subscription.createdAt);
      await this.summaryRepository.update(summary, {
        day: getDate(subscription.createdAt),
        week: getWeek(subscription.createdAt, { weekStartsOn: WEEK_STARTS_ON }),
        month: getMonth(subscription.createdAt) + 1,
        year: getYear(subscription.createdAt),
        newMembersCount: newSign.newMembersCount,
        newMembersIncome: newSign.newMembersIncome,
        newMembersCashIncome: newSign.newMembersCashIncome,
        newMembersTransferIncome: newSign.newMembersTransferIncome,
        newMembersCanceledCount: newSign.newMembersCanceledCount,
        newMembersCanceledIncome: newSign.newMembersCanceledIncome,
        newMembersCanceledCashIncome: newSign.newMembersCanceledCashIncome,
        newMembersCanceledTransferIncome: newSign.newMembersCanceledTransferIncome,
        renewedMembersCount: newSign.renewedMembersCount,
        renewedMembersIncome: newSign.renewedMembersIncome,
        renewedMembersCashIncome: newSign.renewedMembersCashIncome,
        renewedMembersTransferIncome: newSign.renewedMembersTransferIncome,
        renewedMembersCanceledCount: newSign.renewedMembersCanceledCount,
        renewedMembersCanceledIncome: newSign.renewedMembersCanceledIncome,
        renewedMembersCanceledCashIncome: newSign.renewedMembersCanceledCashIncome,
        renewedMembersCanceledTransferIncome: newSign.renewedMembersCanceledTransferIncome,
        gymClassesCount: newSign.gymClassesCount,
        gymClassesIncome: newSign.gymClassesIncome,
        gymClassesCashIncome: newSign.gymClassesCashIncome,
        gymClassesTransferIncome: newSign.gymClassesTransferIncome,
        gymClassesCanceledCount: newSign.gymClassesCanceledCount,
        gymClassesCanceledIncome: newSign.gymClassesCanceledIncome,
        gymClassesCanceledCashIncome: newSign.gymClassesCanceledCashIncome,
        gymClassesCanceledTransferIncome: newSign.gymClassesCanceledTransferIncome,
        totalCanceled: newSign.newMembersCanceledIncome + newSign.renewedMembersCanceledIncome + newSign.gymClassesCanceledIncome,
        totalIncome: newSign.totalIncome,
        totalCashIncome: newSign.totalCashIncome,
        totalTransferIncome: newSign.totalTransferIncome,
        totalAmount: newSign.newMembersIncome + newSign.renewedMembersIncome + newSign.gymClassesIncome,
        isModified: true
      })
    } catch (error) {
      // Si hay un error, revertimos la transacción
      console.log(error);
    }
  }

  async removeOrRestore({ changeTo, id }: RemoveRestoreSubscriptionsOptions): Promise<void> {
    // Buscamos la suscripción por su ID
    const subscription = await this.subscriptionRepository.findOneBy({ id });
  
    // Si no se encuentra la suscripción, lanzamos una excepción
    if (!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    const previousSubsCount = await this.subscriptionRepository.count({
      where: {
        memberId: subscription.memberId,
        createdAt: LessThan(subscription.createdAt),
      },
    });
  
    // Buscamos el resumen (summary) correspondiente a la fecha de creación de la suscripción
    const summary = await this.summaryRepository.findOne({
      where: {
        day: getDate(subscription.createdAt),
        month: getMonth(subscription.createdAt) + 1,
        year: getYear(subscription.createdAt),
      },
    });
  
    // Si no existe un summary, solo actualizamos la suscripción y salimos
    if (!summary) {
      await this.subscriptionRepository.update(id, { isCanceled: changeTo });
      return;
    }
  
    // Si existe un summary, necesitamos realizar ambas modificaciones dentro de una transacción
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
  
    // Iniciar la transacción
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      // Actualizamos la suscripción para cambiar el estado de cancelación
      await queryRunner.manager.update(Subscription, id, { isCanceled: changeTo });
  
      // Marcamos el summary como modificado
      const options: QueryPartialEntity<Summary> = {
        isModified: true
      }

      if (previousSubsCount >= 1 && changeTo === true) {
        // Counts
        options.renewedMembersCount = +summary.renewedMembersCount - 1
        options.renewedMembersCanceledCount = +summary.renewedMembersCanceledCount + 1
        // Incomes
        options.renewedMembersIncome = +summary.renewedMembersIncome - subscription.amount
        options.renewedMembersCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.renewedMembersCashIncome - subscription.amount : +summary.renewedMembersCashIncome
        options.renewedMembersTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.renewedMembersTransferIncome - subscription.amount : +summary.renewedMembersTransferIncome
        options.renewedMembersCanceledIncome = +summary.renewedMembersCanceledIncome + subscription.amount
        options.renewedMembersCanceledCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.renewedMembersCanceledCashIncome + subscription.amount : +summary.renewedMembersCanceledCashIncome
        options.renewedMembersCanceledTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.renewedMembersCanceledTransferIncome + subscription.amount : +summary.renewedMembersCanceledTransferIncome
        // Totals
        options.totalIncome = +summary.totalIncome - subscription.amount
        options.totalCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.totalCashIncome - subscription.amount : +summary.totalCashIncome
        options.totalTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.totalTransferIncome - subscription.amount : +summary.totalTransferIncome
        options.totalCanceled = +summary.totalCanceled + subscription.amount
        options.totalAmount = +summary.totalIncome - subscription.amount
      } else if (previousSubsCount >= 1 && changeTo === false) {
        // Counts
        options.renewedMembersCount = +summary.renewedMembersCount + 1
        options.renewedMembersCanceledCount = +summary.renewedMembersCanceledCount - 1
        // Incomes
        options.renewedMembersIncome = +summary.renewedMembersIncome + subscription.amount
        options.renewedMembersCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.renewedMembersCashIncome + subscription.amount : +summary.renewedMembersCashIncome
        options.renewedMembersTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.renewedMembersTransferIncome + subscription.amount : +summary.renewedMembersTransferIncome
        options.renewedMembersCanceledIncome = +summary.renewedMembersCanceledIncome - subscription.amount
        options.renewedMembersCanceledCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.renewedMembersCanceledCashIncome - subscription.amount : +summary.renewedMembersCanceledCashIncome
        options.renewedMembersCanceledTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.renewedMembersCanceledTransferIncome - subscription.amount : +summary.renewedMembersCanceledTransferIncome
        // Totals
        options.totalIncome = +summary.totalIncome + subscription.amount
        options.totalCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.totalCashIncome + subscription.amount : +summary.totalCashIncome
        options.totalTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.totalTransferIncome + subscription.amount : +summary.totalTransferIncome
        options.totalCanceled = +summary.totalCanceled - subscription.amount
        options.totalAmount = +summary.totalIncome + subscription.amount
      } else if (previousSubsCount === 0 && changeTo === true) {
        // Counts
        options.newMembersCount = +summary.newMembersCount - 1
        options.newMembersCanceledCount = +summary.newMembersCanceledCount + 1
        // Incomes
        options.newMembersIncome = +summary.newMembersIncome - subscription.amount
        options.newMembersCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.newMembersCashIncome - subscription.amount : +summary.newMembersCashIncome
        options.newMembersTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.newMembersTransferIncome - subscription.amount : +summary.newMembersTransferIncome
        options.newMembersCanceledIncome = +summary.newMembersCanceledIncome + subscription.amount
        options.newMembersCanceledCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.newMembersCanceledCashIncome + subscription.amount : +summary.newMembersCanceledCashIncome
        options.newMembersCanceledTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.newMembersCanceledTransferIncome + subscription.amount : +summary.newMembersCanceledTransferIncome
        // Totals
        options.totalIncome = +summary.totalIncome - subscription.amount
        options.totalCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.totalCashIncome - subscription.amount : +summary.totalCashIncome
        options.totalTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.totalTransferIncome - subscription.amount : +summary.totalTransferIncome
        options.totalCanceled = +summary.totalCanceled + subscription.amount
        options.totalAmount = +summary.totalIncome - subscription.amount
      } else if (previousSubsCount === 0 && changeTo === false) {
        // Counts
        options.newMembersCount = +summary.newMembersCount + 1
        options.newMembersCanceledCount = +summary.newMembersCanceledCount - 1
        // Incomes
        options.newMembersIncome = +summary.newMembersIncome + subscription.amount
        options.newMembersCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.newMembersCashIncome + subscription.amount : +summary.newMembersCashIncome
        options.newMembersTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.newMembersTransferIncome + subscription.amount : +summary.newMembersTransferIncome
        options.newMembersCanceledIncome = +summary.newMembersCanceledIncome - subscription.amount
        options.newMembersCanceledCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.newMembersCanceledCashIncome - subscription.amount : +summary.newMembersCanceledCashIncome
        options.newMembersCanceledTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.newMembersCanceledTransferIncome - subscription.amount : +summary.newMembersCanceledTransferIncome
        // Totals
        options.totalIncome = +summary.totalIncome + subscription.amount
        options.totalCashIncome = subscription.paymentMethod === "Efectivo" ? +summary.totalCashIncome + subscription.amount : +summary.totalCashIncome
        options.totalTransferIncome = subscription.paymentMethod === "Transferencia" ? +summary.totalTransferIncome + subscription.amount : +summary.totalTransferIncome
        options.totalCanceled = +summary.totalCanceled - subscription.amount
        options.totalAmount = +summary.totalIncome + subscription.amount
      }

      await queryRunner.manager.update(Summary, summary.id, options);
  
      // Confirmamos la transacción
      await queryRunner.commitTransaction();
    } catch (error) {
      // Si hay un error, revertimos la transacción
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Finalmente, liberamos el queryRunner
      await queryRunner.release();
    }
  }

}
