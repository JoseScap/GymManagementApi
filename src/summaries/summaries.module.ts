import { Module } from '@nestjs/common';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionSummary } from './entities/subscription_summary.view';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionSummary])],
  controllers: [SummariesController],
  providers: [SummariesService]
})
export class SummariesModule {}
