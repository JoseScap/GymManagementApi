import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from './entities/test.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private testsRepository: Repository<Test>
  ) { }

  findAll(): Promise<Test[]> {
    return this.testsRepository.find();
  }

  findOne(id: string): Promise<Test | null> {
    return this.testsRepository.findOneBy({ id })
  }
}
