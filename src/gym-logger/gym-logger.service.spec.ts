import { Test, TestingModule } from '@nestjs/testing';
import { GymLoggerService } from './gym-logger.service';

describe('GymLoggerService', () => {
  let service: GymLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GymLoggerService],
    }).compile();

    service = module.get<GymLoggerService>(GymLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
