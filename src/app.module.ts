import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './tests/entities/test.entity';
import { Member } from './members/entities/member.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommunicationsModule } from './communications/communications.module';
import { TestsModule } from './tests/tests.module';
import { MembersModule } from './members/members.module';
import { FingerprintsModule } from './fingerprints/fingerprints.module';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { Fingerprint } from './fingerprints/entities/fingerprint.entity';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SummariesModule } from './summaries/summaries.module';
import { SubscriptionSummary } from './summaries/entities/subscription_summary.view';
import { GymClassModule } from './gym-class/gym-class.module';
import { GymClass } from './gym-class/entities/gym-class.entity';
import { Summary } from './summaries/entities/summary.entity';
import { GymLoggerModule } from './gym-logger/gym-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DATABASE_TYPE'),
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        database: configService.get<string>('DATABASE_NAME'),
        username: configService.get<string>('GU_DATABASE_USERNAME'),
        password: configService.get<string>('GU_DATABASE_PASSWORD'),
        entities: [Test, Member, Subscription, Fingerprint, GymClass, SubscriptionSummary, Summary],
        synchronize: false,
        logging: true,
        logger: 'file'
      }),
      inject: [ConfigService]
    }),
    TestsModule,
    MembersModule,
    SubscriptionsModule,
    CommunicationsModule,
    FingerprintsModule,
    SummariesModule,
    GymClassModule,
    GymLoggerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
