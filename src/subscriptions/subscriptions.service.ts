import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionsRequest } from './dto/request/create-subscriptions.request';
import { UpdateSubscriptionsRequest } from './dto/request/update-subscriptions.request';
import { Subscription } from './entities/subscription.entity';
import { DataSource, Like, QueryRunner, Repository } from 'typeorm';
import { PER_PAGE } from 'src/common/constants';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { RemoveRestoreSubscriptionsOptions } from './dto/service/remove-restore.dto';
import { Member } from 'src/members/entities/member.entity';
import { ActiveMemberStatus, MemberStatus } from 'src/members/enums/member.enum';
import { FindPaginatedOptions } from './types/service-options';
@Injectable()
export class SubscriptionsService {

  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private dataSource: DataSource
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
      countQuery = countQuery.andWhere('ggcc.createdAt BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo });
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
      dataQuery = dataQuery.andWhere('ggcc.createdAt BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo });
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
    const subscription = await this.subscriptionRepository.findOneBy({ id });

    if(!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    // Definir si esto será un removeOrRestore como en el de members
    await this.subscriptionRepository.update(id, { isCanceled: changeTo });
  }

}
