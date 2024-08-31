import { Module } from '@nestjs/common';
import { GymClassService } from './gym-class.service';
import { GymClassController } from './gym-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClass } from './entities/gym-class.entity';
import { Summary } from 'src/summaries/entities/summary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GymClass]),
    TypeOrmModule.forFeature([Summary]),
  ],
  controllers: [GymClassController],
  providers: [GymClassService],
})
export class GymClassModule {}
