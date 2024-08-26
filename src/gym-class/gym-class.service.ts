import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGymClassRequest } from './dto/request/create-gymClass.request';
import { Repository } from 'typeorm';
import { GymClass } from './entities/gym-class.entity';
import { UpdateGymClassRequest } from './dto/request/update-gymClass.request';

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

  findAll(): Promise<GymClass[]> {
    return this.gymClassRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} gymClass`;
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
