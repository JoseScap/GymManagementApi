import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionsRequest } from './dto/request/create-subscriptions.request';
import { UpdateSubscriptionsRequest } from './dto/request/update-subscriptions.request';
import { Subscription } from './entities/subscription.entity';
import { DataSource, LessThan, QueryRunner, Repository } from 'typeorm';
import { PER_PAGE } from 'src/common/constants';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { RemoveRestoreSubscriptionsOptions } from './dto/service/remove-restore.dto';
import { Member } from 'src/members/entities/member.entity';
import { ActiveMemberStatus, MemberStatus } from 'src/members/enums/member.enum';
import { Summary } from 'src/summaries/entities/summary.entity';
import { getDate, getMonth, getYear } from 'date-fns';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindPaginatedOptions } from './types/service-options';

@Injectable()
export class SubscriptionsService {

  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
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

  async update(id: string, updateSubscriptionsDto: UpdateSubscriptionsRequest): Promise<void> {
    const subscription = await this.subscriptionRepository.findOneBy({ id });

    if (!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    await this.subscriptionRepository.update(subscription, updateSubscriptionsDto);
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
        options.renewedMembersCanceledIncome = +summary.renewedMembersCanceledIncome + subscription.amount
        // Totals
        options.totalIncome = +summary.totalIncome - subscription.amount
        options.totalCanceled = +summary.totalCanceled + subscription.amount
        options.totalAmount = +summary.totalIncome - subscription.amount
      } else if (previousSubsCount >= 1 && changeTo === false) {
        // Counts
        options.renewedMembersCount = +summary.renewedMembersCount + 1
        options.renewedMembersCanceledCount = +summary.renewedMembersCanceledCount - 1
        // Incomes
        options.renewedMembersIncome = +summary.renewedMembersIncome + subscription.amount
        options.renewedMembersCanceledIncome = +summary.renewedMembersCanceledIncome - subscription.amount
        // Totals
        options.totalIncome = +summary.totalIncome + subscription.amount
        options.totalCanceled = +summary.totalCanceled - subscription.amount
        options.totalAmount = +summary.totalIncome + subscription.amount
      } else if (previousSubsCount === 0 && changeTo === true) {
        // Counts
        options.newMembersCount = +summary.newMembersCount - 1
        options.newMembersCanceledCount = +summary.newMembersCanceledCount + 1
        // Incomes
        options.newMembersIncome = +summary.newMembersIncome - subscription.amount
        options.newMembersCanceledIncome = +summary.newMembersCanceledIncome + subscription.amount
        // Totals
        options.totalIncome = +summary.totalIncome - subscription.amount
        options.totalCanceled = +summary.totalCanceled + subscription.amount
        options.totalAmount = +summary.totalIncome - subscription.amount
      } else if (previousSubsCount === 0 && changeTo === false) {
        // Counts
        options.newMembersCount = +summary.newMembersCount + 1
        options.newMembersCanceledCount = +summary.newMembersCanceledCount - 1
        // Incomes
        options.newMembersIncome = +summary.newMembersIncome + subscription.amount
        options.newMembersCanceledIncome = +summary.newMembersCanceledIncome - subscription.amount
        // Totals
        options.totalIncome = +summary.totalIncome + subscription.amount
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
