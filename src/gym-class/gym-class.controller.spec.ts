import { Test, TestingModule } from '@nestjs/testing';
import { GymClassController } from './gym-class.controller';
import { GymClassService } from './gym-class.service';

describe('GymClassController', () => {
  let controller: GymClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GymClassController],
      providers: [GymClassService],
    }).compile();

    controller = module.get<GymClassController>(GymClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
