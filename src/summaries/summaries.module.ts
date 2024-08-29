import { Module } from '@nestjs/common';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionSummary } from './entities/subscription_summary.view';
import { GymClassSummary } from './entities/gym_class_summary.view';
import { Summary } from './entities/summary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionSummary]),
    TypeOrmModule.forFeature([GymClassSummary]),
    TypeOrmModule.forFeature([Summary])
  ],
  controllers: [SummariesController],
  providers: [SummariesService]
})
export class SummariesModule {}
