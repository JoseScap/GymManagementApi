import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FingerprintsService } from './fingerprints.service';
import { CreateOneRequest } from './dto/request/create-one.request';
import { UpdateFingerprintDto } from './dto/request/update-fingerprint.dto';
import { CreateOneFingerprintResponse } from './dto/response/create-one.response';

@Controller('fingerprints')
export class FingerprintsController {
  constructor(private readonly fingerprintsService: FingerprintsService) {}

  @Post()
  async create(@Body() createFingerprintDto: CreateOneRequest): Promise<CreateOneFingerprintResponse> {
    await this.fingerprintsService.create(createFingerprintDto);
    return { data: null }
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
