import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestsModule } from './tests/tests.module';
import { Test } from './tests/entities/test.entity';
import { MembersModule } from './members/members.module';
import { Member } from './members/entities/member.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DATABASE_TYPE'),
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        database: configService.get<string>('DATABASE_NAME'),
        username: configService.get<string>('GM_DATABASE_USERNAME'),
        password: configService.get<string>('GM_DATABASE_PASSWORD'),
        entities: [Test, Member],
        synchronize: false,
        logging: true,
        logger: 'simple-console'
      }),
      inject: [ConfigService]
    }),
    TestsModule,
    MembersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
