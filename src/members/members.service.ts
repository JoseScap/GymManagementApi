import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { CreateMemberRequest } from './dto/request/create-member.request';
import { UpdateMemberRequest } from './dto/request/update-member.request';
import { PER_PAGE } from 'src/common/constants';
import { RemoveRestoreMemberOptions } from './dto/service/remove-restore.dto';
@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>
  ) { }

  async create(createMemberDto: CreateMemberRequest): Promise<void> {
    const newMember = this.memberRepository.create(createMemberDto);
    await this.memberRepository.save(newMember);
  }

  async findPaginated(page: number): Promise<PaginatedApiResponse<Member>> {
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
    const data = await this.memberRepository.find({
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE
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

  async findOne(id: string, embedSubscriptions: boolean): Promise<Member> {
    let member: Member;
    
    if (embedSubscriptions) member = await this.memberRepository.findOne({ where: { id }, relations: { subscriptions: true } })
    else member = await this.memberRepository.findOneBy({ id })
    
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
