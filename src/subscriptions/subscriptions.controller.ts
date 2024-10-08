import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseBoolPipe } from '@nestjs/common';
import { CreateSubscriptionsRequest } from './dto/request/create-subscriptions.request';
import { SubscriptionsService } from './subscriptions.service';
import { FindOneSubscriptionResponse } from './dto/response/find-one.response';
import { CreateOneSubscriptionResponse } from './dto/response/create-one.response';
import { UpdateSubscriptionsRequest } from './dto/request/update-subscriptions.request';
import { RestoreSubscriptionResponse } from './dto/response/restore-subscription.response';
import { RemoveSubscriptionResponse } from './dto/response/remove-subscription.response';
import { UpdateSubscriptionsResponse } from './dto/response/update-subscription.response';
import { FindPaginatedSubscriptionsResponse } from './dto/response/find-paginated.response';
import { FindPaginatedQuery } from './dto/request/find-paginated.query';
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create-one')
  async createOne(@Body() createSubscriptionRequest: CreateSubscriptionsRequest): Promise<CreateOneSubscriptionResponse> {
    await this.subscriptionsService.create(createSubscriptionRequest);
    return { data: null }
  }

  @Get('find-paginated')
  async findPaginated(
    @Query() queries: FindPaginatedQuery
  ): Promise<FindPaginatedSubscriptionsResponse> {
    return this.subscriptionsService.findPaginated(queries)
  }

  @Get('fina-one/:id')
  async findOne(
    @Param('id') id: string,
    @Query('embedMember', ParseBoolPipe) embedMember: boolean
  ): Promise<FindOneSubscriptionResponse> {
    const data = await this.subscriptionsService.findOne(id, embedMember);
    return { data }
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateSubscriptionsRequest: UpdateSubscriptionsRequest): Promise<UpdateSubscriptionsResponse> {
    await this.subscriptionsService.update(id, updateSubscriptionsRequest);
    return { data: null }
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string): Promise<RemoveSubscriptionResponse> {
    await this.subscriptionsService.removeOrRestore({ id, changeTo: true });
    return { data: null }
  }

  @Delete('restore/:id')
  async restore(@Param('id') id: string): Promise<RestoreSubscriptionResponse> {
    await this.subscriptionsService.removeOrRestore({ id, changeTo: false });
    return { data: null }
  }
}
