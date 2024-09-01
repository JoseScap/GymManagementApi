import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOneFingerprintRequest } from './dto/request/create-one.request';
import { UpdateOneFingerprintRequest } from './dto/request/update-one.request';
import { Fingerprint } from './entities/fingerprint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedApiResponse } from 'src/types/ApiResponse';

@Injectable()
export class FingerprintsService {
  constructor(
    @InjectRepository(Fingerprint)
    private repository: Repository<Fingerprint>
  ) { }

  async create(createOneRequest: CreateOneFingerprintRequest): Promise<Fingerprint> {
    const newFingerTemplate = this.repository.create(createOneRequest)
    return await this.repository.save(newFingerTemplate)
  }

  async findPaginated(page: number): Promise<PaginatedApiResponse<Fingerprint>> {
    if (page < 1) page = 1
    const perPage = 1500;

    // Contamos cuantos miembros hay
    const items = await this.repository.count();

    // Calculamos la primer pagina y si existe anterior
    const first = items > 0 ? 1 : 0
    const prev: number | null = page === 1 || first === 0 ? null : page - 1;

    // Calculamos la ultima y si existe una siguiente
    const last = Math.ceil(items / perPage);
    const next: number | null = page >= last ? null : page + 1;

    // La cantidad de paginas coincide con la ultima
    const pages = last;

    // buscamos la data
    const data = await this.repository.find({
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
    const fingerprint = await this.repository.findOneBy({ id })
    if (!fingerprint) {
      throw new NotFoundException(`Fingerprint with ID ${id} not found`);
    }
    return fingerprint;
  }

  async update(id: number, updateFingerprintDto: UpdateOneFingerprintRequest): Promise<void> {
    const fingerprint = await this.repository.findOneBy({ id });
    if (!fingerprint) {
      throw new NotFoundException(`Fingerprint with ID ${id} not found`);
    }
    await this.repository.update({ id }, updateFingerprintDto);
  }

  async remove(id: number): Promise<number> {
    const fingerprint = await this.repository.findOneBy({ id })
    if (!fingerprint) {
      throw new NotFoundException(`Fingerprint with ID ${id} not found`);
    }
    await this.repository.remove(fingerprint)
    return fingerprint.id 
  }
}
