import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGymClassRequest } from './dto/request/create-gymClass.request';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { GymClass } from './entities/gym-class.entity';
import { UpdateGymClassRequest } from './dto/request/update-gymClass.request';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { PER_PAGE, WEEK_STARTS_ON } from 'src/common/constants';
import { Summary } from 'src/summaries/entities/summary.entity';
import { getDate, getMonth, getWeek, getYear } from 'date-fns';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindPaginatedOptions } from './types/service-options';
import { GroupedSubSummary } from 'src/summaries/entities/grouped_sub_summary.view';
import { GroupedGgccSummary } from 'src/summaries/entities/grouped_ggcc_summary.view';
import { SubscriptionSummary } from 'src/summaries/entities/subscription_summary.view';

@Injectable()
export class GymClassService {
  constructor(
    @InjectRepository(GymClass)
    private gymClassRepository: Repository<GymClass>,
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
    @InjectRepository(SubscriptionSummary)
    private subSummaryRepository: Repository<SubscriptionSummary>,
    private dataSource: DataSource,
  ) {}

  async create(request: CreateGymClassRequest): Promise<string> {
    const gymClass = this.gymClassRepository.create(request);
    const savedGymClass = await this.gymClassRepository.save(gymClass);
    return savedGymClass.id;
  }

  async findPaginated({ page, className, date, professor }: FindPaginatedOptions): Promise<PaginatedApiResponse<GymClass>> {
    // Si la página es menor que 1, la establecemos en 1 para evitar paginación incorrecta
    if (!(page < 1)) page = 1;
  
    // Creamos un query builder para contar la cantidad total de elementos que coinciden con los filtros
    let countQuery = this.gymClassRepository
      .createQueryBuilder('ggcc');
  
    // Filtramos por nombre de clase (insensible a mayúsculas/minúsculas)
    if (className) {
      countQuery = countQuery.andWhere('LOWER(ggcc.className) LIKE LOWER(:className)', { className: `%${className}%` });
    }
  
    // Filtramos por fecha, asegurándonos de que coincidan exactamente las fechas ignorando las horas
    if (date) {
      countQuery = countQuery.andWhere('DATE(ggcc.date) = DATE(:date)', { date });
    }
  
    // Filtramos por nombre del profesor (insensible a mayúsculas/minúsculas)
    if (professor) {
      countQuery = countQuery.andWhere('LOWER(ggcc.professor) LIKE LOWER(:professor)', { professor: `%${professor}%` });
    }
  
    // Obtenemos el conteo total de elementos que cumplen con los filtros aplicados
    const items = await countQuery.getCount();
  
    // Determinamos el número de la primera página, que siempre es 1 si hay elementos, o 0 si no los hay
    const first = items > 0 ? 1 : 0;
    
    // Calculamos la última página basada en el total de elementos y el tamaño de página (PER_PAGE)
    const last = Math.ceil(items / PER_PAGE);
  
    // Establecemos la página previa; si estamos en la primera página o no hay elementos, es null
    const prev: number | null = page === 1 || first === 0 ? null : page - 1;
  
    // Establecemos la página siguiente; si estamos en la última página, es null
    const next: number | null = page >= last ? null : page + 1;
  
    // El total de páginas es simplemente el número de la última página
    const pages = last;
  
    // Creamos un nuevo query builder para obtener los datos paginados según los filtros
    let dataQuery = this.gymClassRepository
      .createQueryBuilder('ggcc');
  
    // Aplicamos los mismos filtros de nombre de clase
    if (className) {
      dataQuery = dataQuery.andWhere('LOWER(ggcc.className) LIKE LOWER(:className)', { className: `%${className}%` });
    }
  
    // Aplicamos los mismos filtros de fecha exacta
    if (date) {
      dataQuery = dataQuery.andWhere('DATE(ggcc.date) = DATE(:date)', { date });
    }
  
    // Aplicamos los mismos filtros de nombre del profesor
    if (professor) {
      dataQuery = dataQuery.andWhere('LOWER(ggcc.professor) LIKE LOWER(:professor)', { professor: `%${professor}%` });
    }
  
    // Ordenamos los resultados por la fecha de creación en orden descendente
    dataQuery = dataQuery.orderBy('ggcc.createdAt', 'DESC')
      // Paginamos los resultados calculando el offset según la página actual y el tamaño de página
      .skip((page - 1) * PER_PAGE)
      // Limitamos el número de resultados a retornar por página
      .take(PER_PAGE);
  
    // Ejecutamos la consulta y obtenemos los resultados
    const data = await dataQuery.getMany();
  
    // Retornamos la respuesta paginada con toda la información de paginación y los datos obtenidos
    return {
      first,
      prev,
      next,
      last,
      pages,
      items,
      data,
    };
  }

  async findOne(id: string): Promise<GymClass> {
    const gymClass = await this.gymClassRepository.findOneBy({ id });
    if (!gymClass) {
      throw new NotFoundException(`Gym class with ID ${id} not found`);
    }
    return gymClass;
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

    const gymClasses = await this.gymClassRepository.createQueryBuilder('ggcc')
        .select('DATE(ggcc.createdAt)', 'date')
        .addSelect('SUM(ggcc.total)', 'total')
        .addSelect('SUM(ggcc.transferTotal)', 'transferTotal')
        .addSelect('COUNT(ggcc.id)', 'count')
        .where('ggcc.isCanceled = 0')
        .andWhere('DATE(ggcc.createdAt) = DATE(:date)', { date })
        .groupBy('DATE(ggcc.createdAt)')
        .getRawMany<GroupedGgccSummary>()

    const canceledGymClasses = await this.gymClassRepository.createQueryBuilder('ggcc')
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

  async update(id: string, updateGymClassRequest: UpdateGymClassRequest): Promise<void> {
    const gymClass = await this.gymClassRepository.findOneBy({ id });

    if (!gymClass) {
      throw new NotFoundException(`Gym class with ID ${id} not found`);
    }

    // Buscamos el resumen (summary) correspondiente a la fecha de creación de la suscripción
    const summary = await this.summaryRepository.findOne({
      where: {
        day: getDate(gymClass.createdAt),
        month: getMonth(gymClass.createdAt) + 1,
        year: getYear(gymClass.createdAt),
      },
    });

    // Si no existe un summary, solo actualizamos la suscripción y salimos
    await this.gymClassRepository.update(gymClass, updateGymClassRequest);
    if (!summary) {
      return;
    }

    try {
      const newSign = await this.getSign(gymClass.createdAt);
      await this.summaryRepository.update(summary, {
        day: getDate(gymClass.createdAt),
        week: getWeek(gymClass.createdAt, { weekStartsOn: WEEK_STARTS_ON }),
        month: getMonth(gymClass.createdAt) + 1,
        year: getYear(gymClass.createdAt),
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
      })
    } catch (error) {
      // Si hay un error, revertimos la transacción
      console.log(error);
    }

  }

  async removeOrRestore({ id, changeTo }: { id: string; changeTo: boolean }) {
    const gymClass = await this.gymClassRepository.findOneBy({ id });
    if (!gymClass) {
      throw new InternalServerErrorException(`Gym class with ID ${id} not found`);
    }

    // Buscamos el resumen (summary) correspondiente a la fecha de creación de la suscripción
    const summary = await this.summaryRepository.findOne({
      where: {
        day: getDate(gymClass.createdAt),
        month: getMonth(gymClass.createdAt) + 1,
        year: getYear(gymClass.createdAt),
      },
    });

    // Si no existe un summary, solo actualizamos la suscripción y salimos
    if (!summary) {
      await this.gymClassRepository.update(id, { isCanceled: changeTo });
      return;
    }

    // Si existe un summary, necesitamos realizar ambas modificaciones dentro de una transacción
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    // Iniciar la transacción
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Actualizamos la suscripción para cambiar el estado de cancelación
      await queryRunner.manager.update(GymClass, id, { isCanceled: changeTo });
  
      // Marcamos el summary como modificado
      const options: QueryPartialEntity<Summary> = {
        isModified: true
      }

      if (changeTo === true) {
        // Counts
        options.gymClassesCount = +summary.gymClassesCount - 1
        options.gymClassesCanceledCount = +summary.gymClassesCanceledCount + 1
        // Incomes
        options.gymClassesIncome = +summary.gymClassesIncome - gymClass.total
        options.gymClassesCashIncome = +summary.gymClassesCashIncome - (gymClass.total - gymClass.transferTotal)
        options.gymClassesTransferIncome = +summary.gymClassesTransferIncome - gymClass.transferTotal
        options.gymClassesCanceledIncome = +summary.gymClassesCanceledIncome + (gymClass.total - gymClass.transferTotal)
        options.gymClassesCanceledCashIncome = +summary.gymClassesCanceledCashIncome + gymClass.total
        options.gymClassesCanceledTransferIncome = +summary.gymClassesCanceledTransferIncome + gymClass.transferTotal
        // Totals
        options.totalIncome = +summary.totalIncome - gymClass.total
        options.totalCashIncome = +summary.totalCashIncome - (gymClass.total - gymClass.transferTotal)
        options.totalTransferIncome = +summary.totalTransferIncome - gymClass.transferTotal
        options.totalCanceled = +summary.totalCanceled + gymClass.total
        options.totalAmount = +summary.totalIncome - gymClass.total
      } else if (changeTo === false) {
        // Counts
        options.gymClassesCount = +summary.gymClassesCount + 1
        options.gymClassesCanceledCount = +summary.gymClassesCanceledCount - 1
        // Incomes
        options.gymClassesIncome = +summary.gymClassesIncome + gymClass.total
        options.gymClassesCashIncome = +summary.gymClassesCashIncome + (gymClass.total - gymClass.transferTotal)
        options.gymClassesTransferIncome = +summary.gymClassesTransferIncome + gymClass.transferTotal
        options.gymClassesCanceledIncome = +summary.gymClassesCanceledIncome - gymClass.total
        options.gymClassesCanceledCashIncome = +summary.gymClassesCanceledCashIncome - (gymClass.total - gymClass.transferTotal)
        options.gymClassesCanceledTransferIncome = +summary.gymClassesCanceledTransferIncome - gymClass.transferTotal
        // Totals
        options.totalIncome = +summary.totalIncome + gymClass.total
        options.totalCashIncome = +summary.totalIncome + (gymClass.total - gymClass.transferTotal)
        options.totalTransferIncome = +summary.totalIncome + gymClass.transferTotal
        options.totalCanceled = +summary.totalCanceled - gymClass.total
        options.totalAmount = +summary.totalIncome + gymClass.total
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
