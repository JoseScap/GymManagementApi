import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    TypeOrmModule.forFeature([Subscription])
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
