import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGymClassRequest } from './dto/request/create-gymClass.request';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { GymClass } from './entities/gym-class.entity';
import { UpdateGymClassRequest } from './dto/request/update-gymClass.request';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { PER_PAGE } from 'src/common/constants';
import { Summary } from 'src/summaries/entities/summary.entity';
import { getDate, getMonth, getYear } from 'date-fns';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class GymClassService {
  constructor(
    @InjectRepository(GymClass)
    private gymClassRepository: Repository<GymClass>,
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
    private dataSource: DataSource,
  ) {}

  async create(request: CreateGymClassRequest): Promise<string> {
    const gymClass = this.gymClassRepository.create(request);
    const savedGymClass = await this.gymClassRepository.save(gymClass);
    return savedGymClass.id;
  }

  async findPaginated(page: number): Promise<PaginatedApiResponse<GymClass>> {
    let data: GymClass[]
    if (page < 1) page = 1

    const items = await this.gymClassRepository.count()

    const first = items > 0 ? 1 : 0
    const prev: number | null = page === 1 || first === 0 ? null : page - 1;

    const last = Math.ceil(items / PER_PAGE);
    const next: number | null = page >= last ? null : page + 1;

    const pages = last;

    data = await this.gymClassRepository.find({
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      order: {
        createdAt: 'DESC'
      }
    });
      
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

  async findOne(id: string): Promise<GymClass> {
    const gymClass = await this.gymClassRepository.findOneBy({ id });
    if (!gymClass) {
      throw new NotFoundException(`Gym class with ID ${id} not found`);
    }
    return gymClass;
  }

  async update(id: string, updateGymClassRequest: UpdateGymClassRequest): Promise<void> {
    const gymClass = await this.gymClassRepository.findOneBy({ id });

    if (!gymClass) {
      throw new NotFoundException(`Gym class with ID ${id} not found`);
    }

    await this.gymClassRepository.save({ ...gymClass, ...updateGymClassRequest });
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
        options.gymClassesCanceledIncome = +summary.gymClassesCanceledIncome + gymClass.total
        // Totals
        options.totalIncome = +summary.totalIncome - gymClass.total
        options.totalCanceled = +summary.totalCanceled + gymClass.total
        options.totalAmount = +summary.totalIncome - gymClass.total
      } else if (changeTo === false) {
        // Counts
        options.gymClassesCount = +summary.gymClassesCount + 1
        options.gymClassesCanceledCount = +summary.gymClassesCanceledCount - 1
        // Incomes
        options.gymClassesIncome = +summary.gymClassesIncome + gymClass.total
        options.gymClassesCanceledIncome = +summary.gymClassesCanceledIncome - gymClass.total
        // Totals
        options.totalIncome = +summary.totalIncome + gymClass.total
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
