import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateGymClassDto } from './dto/update-gym-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGymClassRequest } from './dto/request/create-gymClass.request';
import { Repository } from 'typeorm';
import { GymClass } from './entities/gym-class.entity';

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

  update(id: number, updateGymClassDto: UpdateGymClassDto) {
    return `This action updates a #${id} gymClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} gymClass`;
  }
}
