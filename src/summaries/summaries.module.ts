import { Module } from '@nestjs/common';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionSummary } from './entities/subscription_summary.view';
import { Summary } from './entities/summary.entity';
import { GymClass } from 'src/gym-class/entities/gym-class.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionSummary]),
    TypeOrmModule.forFeature([Summary]),
    TypeOrmModule.forFeature([GymClass]),
    TypeOrmModule.forFeature([Subscription]),
  ],
  controllers: [SummariesController],
  providers: [SummariesService]
})
export class SummariesModule {}
