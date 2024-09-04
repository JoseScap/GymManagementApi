import { Module } from '@nestjs/common';
import { GymClassService } from './gym-class.service';
import { GymClassController } from './gym-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClass } from './entities/gym-class.entity';
import { Summary } from 'src/summaries/entities/summary.entity';
import { SubscriptionSummary } from 'src/summaries/entities/subscription_summary.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([GymClass]),
    TypeOrmModule.forFeature([Summary]),
    TypeOrmModule.forFeature([SubscriptionSummary]),
  ],
  controllers: [GymClassController],
  providers: [GymClassService],
})
export class GymClassModule {}
