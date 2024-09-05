import { Module } from '@nestjs/common';
import { GymLoggerService } from './gym-logger.service';

@Module({
  providers: [GymLoggerService],
  exports: [GymLoggerService],
})
export class GymLoggerModule {}
