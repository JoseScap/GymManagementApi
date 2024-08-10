import { Injectable } from '@nestjs/common';
import { CreateOneRequest } from './dto/request/create-one.request';
import { UpdateFingerprintDto } from './dto/request/update-fingerprint.dto';
import { Fingerprint } from './entities/fingerprint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FingerprintsService {
  constructor(
    @InjectRepository(Fingerprint)
    private fingerprintRepository: Repository<Fingerprint>
  ) { }

  async create(createOneRequest: CreateOneRequest): Promise<void> {
    const newFingerTemplate = this.fingerprintRepository.create(createOneRequest)
    await this.fingerprintRepository.save(newFingerTemplate)
  }

  findAll() {
    return `This action returns all fingerprints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fingerprint`;
  }

  update(id: number, updateFingerprintDto: UpdateFingerprintDto) {
    return `This action updates a #${id} fingerprint`;
  }

  remove(id: number) {
    return `This action removes a #${id} fingerprint`;
  }
}
