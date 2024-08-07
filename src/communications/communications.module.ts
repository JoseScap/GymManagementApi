import { Module } from '@nestjs/common';
import { CommunicationsGateway } from './communications.gateway';

@Module({

  providers: [CommunicationsGateway]
})
export class CommunicationsModule { }
