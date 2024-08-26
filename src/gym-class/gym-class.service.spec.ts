import { Test, TestingModule } from '@nestjs/testing';
import { GymClassService } from './gym-class.service';

describe('GymClassService', () => {
  let service: GymClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GymClassService],
    }).compile();

    service = module.get<GymClassService>(GymClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
