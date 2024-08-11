import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FingerprintsService } from './fingerprints.service';
import { CreateOneFingerprintRequest } from './dto/request/create-one.request';
import { UpdateOneFingerprintRequest } from './dto/request/update-one.request';
import { CreateOneFingerprintResponse } from './dto/response/create-one.response';
import { FindPaginatedFingerprintResponse } from './dto/response/find-paginated.response';
import { FindOneFingerprintResponse } from './dto/response/find-one.response';
import { RemoveOneFingerprintResponse } from './dto/response/remove-one.response';

@Controller('fingerprints')
export class FingerprintsController {
  constructor(private readonly fingerprintsService: FingerprintsService) {}

  @Post()
  async create(@Body() createFingerprintDto: CreateOneFingerprintRequest): Promise<CreateOneFingerprintResponse> {
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
  update(@Param('id') id: string, @Body() updateFingerprintDto: UpdateOneFingerprintRequest) {
    return this.fingerprintsService.update(+id, updateFingerprintDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<RemoveOneFingerprintResponse> {
    const deletedId = await this.fingerprintsService.remove(+id);
    return { data: deletedId }
  }
}
