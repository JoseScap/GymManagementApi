import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionsRequest } from './dto/request/create-subscriptions.request';
import { UpdateSubscriptionsRequest } from './dto/request/update-subscriptions.request';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { PER_PAGE } from 'src/common/constants';
import { PaginatedApiResponse } from 'src/types/ApiResponse';
import { RemoveRestoreSubscriptionsOptions } from './dto/service/remove-restore.dto';
@Injectable()
export class SubscriptionsService {

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>
  ) { }

  async create(createSubscriptionsDto: CreateSubscriptionsRequest) {
    const newSubscription = this.subscriptionRepository.create(createSubscriptionsDto);
    await this.subscriptionRepository.save(newSubscription);
  }

  async findPaginated(page: number): Promise<PaginatedApiResponse<Subscription>> {
    if (page < 1) page = 1

    // Contamos cuantos subscriptions hay
    const items = await this.subscriptionRepository.count();

    // Calculamos la primer pagina y si existe anterior
    const first = items > 0 ? 1 : 0
    const prev: number | null = page === 1 || first === 0 ? null : page - 1;

    // Calculamos la ultima y si existe una siguiente
    const last = Math.ceil(items / PER_PAGE);
    const next: number | null = page >= last ? null : page + 1;

    // La cantidad de paginas coincide con la ultima
    const pages = last;

    // buscamos la data
    const data = await this.subscriptionRepository.find({
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE
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

  async findOne(id: string, embedMember: boolean): Promise<Subscription> {
    let subscription: Subscription;

    if (embedMember) subscription = await this.subscriptionRepository.findOne({ where: { id }, relations: { member: true } })
    else subscription = await this.subscriptionRepository.findOneBy({ id })

    if (!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    return subscription
  }

  async update(id: string, updateSubscriptionsDto: UpdateSubscriptionsRequest): Promise<void> {
    const subscription = await this.subscriptionRepository.findOneBy({ id });

    if (!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    await this.subscriptionRepository.update(subscription, updateSubscriptionsDto);
  }

  async removeOrRestore({ changeTo, id }: RemoveRestoreSubscriptionsOptions): Promise<void> {
    const subscription = await this.subscriptionRepository.findOneBy({ id });

    if(!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    // Definir si esto será un removeOrRestore como en el de members
    await this.subscriptionRepository.update(id, { isCanceled: changeTo });
  }
}
