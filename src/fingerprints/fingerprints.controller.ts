import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FingerprintsService } from './fingerprints.service';
import { CreateFingerprintDto } from './dto/request/create-fingerprint.dto';
import { UpdateFingerprintDto } from './dto/request/update-fingerprint.dto';

@Controller('fingerprints')
export class FingerprintsController {
  constructor(private readonly fingerprintsService: FingerprintsService) {}

  @Post()
  create(@Body() createFingerprintDto: CreateFingerprintDto) {
    return this.fingerprintsService.create(createFingerprintDto);
  }

  @Get()
  findAll() {
    return this.fingerprintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fingerprintsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFingerprintDto: UpdateFingerprintDto) {
    return this.fingerprintsService.update(+id, updateFingerprintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fingerprintsService.remove(+id);
  }
}
