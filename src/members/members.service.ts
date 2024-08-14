import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { CreateMemberRequest } from './dto/request/create-member.request';
import { UpdateMemberRequest } from './dto/request/update-member.request';
import { UpdateMemberResponse } from './dto/response/update-member.response';
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
    const last = Math.ceil(items / 10);
    const next: number | null = page >= last ? null : page + 1;

    // La cantidad de paginas coincide con la ultima
    const pages = last;

    // buscamos la data
    const data = await this.memberRepository.find({
      skip: (page - 1) * 10,
      take: 10
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

  findOne(id: string): Promise<Member> {
    return this.memberRepository.findOneBy({ id });
  }

  async update(id: string, updateMemberDto: UpdateMemberRequest): Promise<void> {
    const member = await this.memberRepository.findOneBy({ id });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    await this.memberRepository.update(id,
      updateMemberDto
    );
  }

  async remove(id: string): Promise<void> {
    const member = await this.memberRepository.findOneBy({ id });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    await this.memberRepository.update(id, { isActive: !member.isActive });
  }
}
