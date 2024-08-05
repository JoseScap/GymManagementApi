import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestsModule } from './tests/tests.module';
import { Test } from './tests/entities/test.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test',
      entities: [Test],
      synchronize: false
    }),
    TestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
