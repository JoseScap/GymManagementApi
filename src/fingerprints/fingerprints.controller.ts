import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FingerprintsService } from './fingerprints.service';
import { CreateOneRequest } from './dto/request/create-one.request';
import { UpdateFingerprintDto } from './dto/request/update-fingerprint.dto';
import { CreateOneFingerprintResponse } from './dto/response/create-one.response';
import { FindPaginatedFingerprintResponse } from './dto/response/find-paginated.response';
import { FindOneFingerprintResponse } from './dto/response/find-one.response';

@Controller('fingerprints')
export class FingerprintsController {
  constructor(private readonly fingerprintsService: FingerprintsService) {}

  @Post()
  async create(@Body() createFingerprintDto: CreateOneRequest): Promise<CreateOneFingerprintResponse> {
    await this.fingerprintsService.create(createFingerprintDto);
    return { data: null }
  }

  @Get()
  findPaginated(@Query('page') page: string): Promise<FindPaginatedFingerprintResponse> {
    const parsedPage = Number(page)
    const sanitizedPage = isNaN(parsedPage) ? 1 : parsedPage
    
    return this.fingerprintsService.findPaginated(sanitizedPage);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindOneFingerprintResponse> {
    const fingerprint = await this.fingerprintsService.findOne(+id);
    return { data: fingerprint }
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
