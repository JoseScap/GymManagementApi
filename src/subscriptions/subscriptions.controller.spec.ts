import { Test, TestingModule } from '@nestjs/testing';
import { Subscriptions2Controller } from './subscriptions.controller';
import { Subscriptions2Service } from './subscriptions.service';

describe('Subscriptions2Controller', () => {
  let controller: Subscriptions2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Subscriptions2Controller],
      providers: [Subscriptions2Service],
    }).compile();

    controller = module.get<Subscriptions2Controller>(Subscriptions2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
