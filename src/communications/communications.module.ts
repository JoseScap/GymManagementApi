import { Module } from '@nestjs/common';
import { CommunicationsGateway } from './communications.gateway';
import { MembersService } from 'src/members/members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/member.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Fingerprint } from 'src/fingerprints/entities/fingerprint.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    TypeOrmModule.forFeature([Subscription]),
    TypeOrmModule.forFeature([Fingerprint])
  ],
  providers: [CommunicationsGateway, MembersService]
})
export class CommunicationsModule { }
