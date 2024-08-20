import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { DataSource, FindManyOptions, QueryRunner, Repository } from 'typeorm';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { CreateMemberRequest } from './dto/request/create-member.request';
import { UpdateMemberRequest } from './dto/request/update-member.request';
import { PER_PAGE } from 'src/common/constants';
import { RemoveRestoreMemberOptions } from './dto/service/remove-restore.dto';
import { ActiveMemberStatus, MemberStatus } from './enums/member.enum';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { CreateSubscriptedMemberRequest } from './dto/request/create-subscripted-member.request';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private dataSource: DataSource
  ) { }

  async create(request: CreateMemberRequest): Promise<void> {
    const newMember = this.memberRepository.create(request);
    await this.memberRepository.save(newMember);
  }

  async createOneWithSub(request: CreateSubscriptedMemberRequest): Promise<string> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    let result: string = null;

    // Iniciar la transacción
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear un nuevo miembro
      const member = this.memberRepository.create({
        dni: request.dni,
        fullName: request.fullName,
        phoneNumber: request.phoneNumber,
        currentStatus:
          request.status === ActiveMemberStatus.Día
          ? MemberStatus.Día
          : request.status === ActiveMemberStatus.Semana
          ? MemberStatus.Semana
          : MemberStatus.Mes,
      });
      await queryRunner.manager.save(member);

      // Crear una nueva suscripción para el miembro
      const subscription = this.subscriptionRepository.create({
        amount: request.amount,
        dateFrom: request.dateFrom,
        dateTo: request.dateTo,
        isCanceled: false,
        paymentMethod: request.paymentMethod,
        status: request.status === ActiveMemberStatus.Día
        ? ActiveMemberStatus.Día
        : request.status === ActiveMemberStatus.Semana
        ? ActiveMemberStatus.Semana
        : ActiveMemberStatus.Mes,
        member: member,  
      });
      await queryRunner.manager.save(subscription);

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

  async findPaginated(page: number, embedSubscriptions: boolean, currentStatus?: MemberStatus): Promise<PaginatedApiResponse<Member>> {
    if (page < 1) page = 1

    // Contamos cuantos miembros hay
    const items = await this.memberRepository.count();

    // Calculamos la primer pagina y si existe anterior
    const first = items > 0 ? 1 : 0
    const prev: number | null = page === 1 || first === 0 ? null : page - 1;

    // Calculamos la ultima y si existe una siguiente
    const last = Math.ceil(items / PER_PAGE);
    const next: number | null = page >= last ? null : page + 1;

    // La cantidad de paginas coincide con la ultima
    const pages = last;

    // buscamos la data
    const findManyOptions: FindManyOptions<Member> = {
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      order: {
        createdAt: "DESC"
      },
      relations: { subscriptions: embedSubscriptions },
    }
    if (!!currentStatus) findManyOptions.where = { currentStatus }

    const data = await this.memberRepository.find(findManyOptions);

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

  async findOne(id: string, embedSubscriptions: boolean): Promise<Member> {
    let member: Member;
    
    member = await this.memberRepository.findOne({ where: { id }, relations: { subscriptions: embedSubscriptions } })
    
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return member
  }

  async update(id: string, updateMemberDto: UpdateMemberRequest): Promise<void> {
    const member = await this.memberRepository.findOneBy({ id });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    await this.memberRepository.update(id, updateMemberDto);
  }

  async removeOrRestore({ changeTo, id }: RemoveRestoreMemberOptions): Promise<void> {
    const member = await this.memberRepository.findOneBy({ id: id });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    await this.memberRepository.update(id, { isActive: changeTo });
  }
}
