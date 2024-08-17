import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionsDto } from './dto/request/create-subscriptions.request.dto';
import { UpdateSubscriptionsDto } from './dto/request/update-subscriptions.request.dto';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
@Injectable()
export class SubscriptionsService {

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>
  ) { }

  async create(createSubscriptionsDto: CreateSubscriptionsDto) {
    const newSubscription = this.subscriptionRepository.create(createSubscriptionsDto);
    await this.subscriptionRepository.save(newSubscription);
  }

  findAll() {
    return `This action returns all subscriptions2`;
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

  async update(id: string, updateSubscriptionsDto: UpdateSubscriptionsDto): Promise<void> {
    const subscription = await this.subscriptionRepository.findOneBy({ id });

    if (!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    await this.subscriptionRepository.update(subscription, updateSubscriptionsDto);
  }

  async remove(id: string) {
    const subscription = await this.subscriptionRepository.findOneBy({ id });

    if(!subscription) {
      throw new NotFoundException(`Subscription #${id} not found`);
    }

    // Definir si esto será un removeOrRestore como en el de members
    await this.subscriptionRepository.update(subscription, { isCanceled: true });
  }
}
