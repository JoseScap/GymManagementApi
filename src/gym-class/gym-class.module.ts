import { Module } from '@nestjs/common';
import { GymClassService } from './gym-class.service';
import { GymClassController } from './gym-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClass } from './entities/gym-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GymClass])],
  controllers: [GymClassController],
  providers: [GymClassService],
})
export class GymClassModule {}
