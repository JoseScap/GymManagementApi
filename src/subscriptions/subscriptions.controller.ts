import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateSubscriptionsDto } from './dto/request/create-subscriptions.request.dto';
import { UpdateSubscriptionsDto } from './dto/request/update-subscriptions.request.dto';
import { SubscriptionsService } from './subscriptions.service';

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
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionsDto: UpdateSubscriptionsDto) {
    return this.subscriptionsService.update(+id, updateSubscriptionsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(+id);
  }
}
