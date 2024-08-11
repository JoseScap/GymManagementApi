import { Test, TestingModule } from '@nestjs/testing';
import { FingerprintsController } from './fingerprints.controller';
import { FingerprintsService } from './fingerprints.service';

describe('FingerprintsController', () => {
  let controller: FingerprintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FingerprintsController],
      providers: [FingerprintsService],
    }).compile();

    controller = module.get<FingerprintsController>(FingerprintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
