import { Module } from '@nestjs/common';
import { FingerprintsService } from './fingerprints.service';
import { FingerprintsController } from './fingerprints.controller';

@Module({
  controllers: [FingerprintsController],
  providers: [FingerprintsService],
})
export class FingerprintsModule {}
