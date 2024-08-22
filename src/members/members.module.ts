import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Fingerprint } from 'src/fingerprints/entities/fingerprint.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    TypeOrmModule.forFeature([Subscription]),
    TypeOrmModule.forFeature([Fingerprint])
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService]
})
export class MembersModule {}
