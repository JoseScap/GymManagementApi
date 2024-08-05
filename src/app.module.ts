import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestsModule } from './tests/tests.module';
import { Test } from './tests/entities/test.entity';
import { MembersModule } from './members/members.module';
import { Member } from './members/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test',
      entities: [Test, Member],
      synchronize: false
    }),
    TestsModule,
    MembersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
