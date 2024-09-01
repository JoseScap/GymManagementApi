import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Member } from 'src/members/entities/member.entity';
import { Summary } from 'src/summaries/entities/summary.entity';
import { GymClass } from 'src/gym-class/entities/gym-class.entity';
import { SubscriptionSummary } from 'src/summaries/entities/subscription_summary.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    TypeOrmModule.forFeature([Member]),
    TypeOrmModule.forFeature([Summary]),
    TypeOrmModule.forFeature([SubscriptionSummary]),
    TypeOrmModule.forFeature([GymClass]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
