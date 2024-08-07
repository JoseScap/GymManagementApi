import { Injectable } from '@nestjs/common';
import { CreateFingerprintDto } from './dto/request/create-fingerprint.dto';
import { UpdateFingerprintDto } from './dto/request/update-fingerprint.dto';

@Injectable()
export class FingerprintsService {
  create(createFingerprintDto: CreateFingerprintDto) {
    return 'This action adds a new fingerprint';
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
