import { Injectable } from '@nestjs/common';
import { CreateSubscriptionsDto } from './dto/request/create-subscriptions.request.dto';
import { UpdateSubscriptionsDto } from './dto/request/update-subscriptions.request.dto';

@Injectable()
export class SubscriptionsService {
  create(createSubscriptionsDto: CreateSubscriptionsDto) {
    return 'This action adds a new subscriptions2';
  }

  findAll() {
    return `This action returns all subscriptions2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptions2`;
  }

  update(id: number, updateSubscriptionsDto: UpdateSubscriptionsDto) {
    return `This action updates a #${id} subscriptions2`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptions2`;
  }
}
