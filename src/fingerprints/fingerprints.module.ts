import { Module } from '@nestjs/common';
import { FingerprintsService } from './fingerprints.service';
import { FingerprintsController } from './fingerprints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fingerprint } from './entities/fingerprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fingerprint])],
  controllers: [FingerprintsController],
  providers: [FingerprintsService],
})
export class FingerprintsModule {}
