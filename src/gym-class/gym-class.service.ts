import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGymClassRequest } from './dto/request/create-gymClass.request';
import { Repository } from 'typeorm';
import { GymClass } from './entities/gym-class.entity';
import { UpdateGymClassRequest } from './dto/request/update-gymClass.request';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { PER_PAGE } from 'src/common/constants';

@Injectable()
export class GymClassService {
  constructor(
    @InjectRepository(GymClass)
    private gymClassRepository: Repository<GymClass>,
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

    gymClass.isCanceled = changeTo;
    await this.gymClassRepository.save(gymClass);
  }
}
