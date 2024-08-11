import { Injectable } from '@nestjs/common';
import { CreateOneRequest } from './dto/request/create-one.request';
import { UpdateFingerprintDto } from './dto/request/update-fingerprint.dto';
import { Fingerprint } from './entities/fingerprint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedApiResponse } from 'src/types/ApiResponse';

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

  async findPaginated(page: number): Promise<PaginatedApiResponse<Fingerprint>> {
    if (page < 1) page = 1
    const perPage = 1500;

    // Contamos cuantos miembros hay
    const items = await this.fingerprintRepository.count();

    // Calculamos la primer pagina y si existe anterior
    const first = items > 0 ? 1 : 0
    const prev: number | null = page === 1 || first === 0 ? null : page - 1;

    // Calculamos la ultima y si existe una siguiente
    const last = Math.ceil(items / perPage);
    const next: number | null = page >= last ? null : page + 1;

    // La cantidad de paginas coincide con la ultima
    const pages = last;

    // buscamos la data
    const data = await this.fingerprintRepository.find({
      skip: (page - 1) * perPage,
      take: perPage
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

  async findOne(id: number): Promise<Fingerprint> {
    const fingerprint = await this.fingerprintRepository.findOneBy({ id })
    return fingerprint;
  }

  update(id: number, updateFingerprintDto: UpdateFingerprintDto) {
    return `This action updates a #${id} fingerprint`;
  }

  async remove(id: number): Promise<number> {
    const fingerprint = await this.fingerprintRepository.findOneBy({ id })
    await this.fingerprintRepository.remove(fingerprint)
    return fingerprint.id 
  }
}
