import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGymClassRequest } from './dto/request/create-gymClass.request';
import { Like, Repository } from 'typeorm';
import { GymClass } from './entities/gym-class.entity';
import { UpdateGymClassRequest } from './dto/request/update-gymClass.request';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { PER_PAGE } from 'src/common/constants';
import { FindPaginatedOptions } from './types/service-options';

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

  async findPaginated({ page, className, date, professor }: FindPaginatedOptions): Promise<PaginatedApiResponse<GymClass>> {
    // Si la página es menor que 1, la establecemos en 1 para evitar paginación incorrecta
    if (page < 1) page = 1;
  
    // Creamos un query builder para contar la cantidad total de elementos que coinciden con los filtros
    let countQuery = this.gymClassRepository
      .createQueryBuilder('ggcc');
  
    // Filtramos por nombre de clase (insensible a mayúsculas/minúsculas)
    if (className) {
      countQuery = countQuery.andWhere('LOWER(ggcc.className) LIKE LOWER(:className)', { className: `%${className}%` });
    }
  
    // Filtramos por fecha, asegurándonos de que coincidan exactamente las fechas ignorando las horas
    if (date) {
      countQuery = countQuery.andWhere('DATE(ggcc.date) = DATE(:date)', { date });
    }
  
    // Filtramos por nombre del profesor (insensible a mayúsculas/minúsculas)
    if (professor) {
      countQuery = countQuery.andWhere('LOWER(ggcc.professor) LIKE LOWER(:professor)', { professor: `%${professor}%` });
    }
  
    // Obtenemos el conteo total de elementos que cumplen con los filtros aplicados
    const items = await countQuery.getCount();
  
    // Determinamos el número de la primera página, que siempre es 1 si hay elementos, o 0 si no los hay
    const first = items > 0 ? 1 : 0;
    
    // Calculamos la última página basada en el total de elementos y el tamaño de página (PER_PAGE)
    const last = Math.ceil(items / PER_PAGE);
  
    // Establecemos la página previa; si estamos en la primera página o no hay elementos, es null
    const prev: number | null = page === 1 || first === 0 ? null : page - 1;
  
    // Establecemos la página siguiente; si estamos en la última página, es null
    const next: number | null = page >= last ? null : page + 1;
  
    // El total de páginas es simplemente el número de la última página
    const pages = last;
  
    // Creamos un nuevo query builder para obtener los datos paginados según los filtros
    let dataQuery = this.gymClassRepository
      .createQueryBuilder('ggcc');
  
    // Aplicamos los mismos filtros de nombre de clase
    if (className) {
      dataQuery = dataQuery.andWhere('LOWER(ggcc.className) LIKE LOWER(:className)', { className: `%${className}%` });
    }
  
    // Aplicamos los mismos filtros de fecha exacta
    if (date) {
      dataQuery = dataQuery.andWhere('DATE(ggcc.date) = DATE(:date)', { date });
    }
  
    // Aplicamos los mismos filtros de nombre del profesor
    if (professor) {
      dataQuery = dataQuery.andWhere('LOWER(ggcc.professor) LIKE LOWER(:professor)', { professor: `%${professor}%` });
    }
  
    // Ordenamos los resultados por la fecha de creación en orden descendente
    dataQuery = dataQuery.orderBy('ggcc.createdAt', 'DESC')
      // Paginamos los resultados calculando el offset según la página actual y el tamaño de página
      .skip((page - 1) * PER_PAGE)
      // Limitamos el número de resultados a retornar por página
      .take(PER_PAGE);
  
    // Ejecutamos la consulta y obtenemos los resultados
    const data = await dataQuery.getMany();
  
    // Retornamos la respuesta paginada con toda la información de paginación y los datos obtenidos
    return {
      first,
      prev,
      next,
      last,
      pages,
      items,
      data,
    };
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
