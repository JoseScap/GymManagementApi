import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseBoolPipe } from '@nestjs/common';
import { CreateSubscriptionsDto } from './dto/request/create-subscriptions.request.dto';
import { UpdateSubscriptionsDto } from './dto/request/update-subscriptions.request.dto';
import { SubscriptionsService } from './subscriptions.service';
import { FindOneSubscriptionResponse } from './dto/response/find-one.response';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() createSubscriptionsDto: CreateSubscriptionsDto) {
    return this.subscriptionsService.create(createSubscriptionsDto);
  }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('embedMember', ParseBoolPipe) embedMember: boolean
  ) {
    const data = await this.subscriptionsService.findOne(id, embedMember);
    return { data }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionsDto: UpdateSubscriptionsDto) {
    return this.subscriptionsService.update(id, updateSubscriptionsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }
}
