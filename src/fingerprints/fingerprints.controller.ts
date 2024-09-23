import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FingerprintsService } from './fingerprints.service';
import { CreateOneFingerprintRequest } from './dto/request/create-one.request';
import { UpdateOneFingerprintRequest } from './dto/request/update-one.request';
import { CreateOneFingerprintResponse } from './dto/response/create-one.response';
import { FindPaginatedFingerprintResponse } from './dto/response/find-paginated.response';
import { FindOneFingerprintResponse } from './dto/response/find-one.response';
import { RemoveOneFingerprintResponse } from './dto/response/remove-one.response';
import { UpdateOneFingerprintResponse } from './dto/response/update-one.response';
import { instanceToPlain } from 'class-transformer';

@Controller('fingerprints')
export class FingerprintsController {
  constructor(private readonly service: FingerprintsService) {}

  @Post()
  async createOne(@Body() createFingerprintDto: CreateOneFingerprintRequest): Promise<CreateOneFingerprintResponse> {
    const data = await this.service.create(createFingerprintDto);
    return { data }
  }

  @Get()
  async findPaginated(@Query('page') page: string) {
    const parsedPage = Number(page)
    const sanitizedPage = isNaN(parsedPage) ? 1 : parsedPage
    
    const fingerPrints = await this.service.findPaginated(sanitizedPage);
    const response = instanceToPlain(fingerPrints);
    return response
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindOneFingerprintResponse> {
    const fingerprint = await this.service.findOne(+id);
    return { data: fingerprint }
  }

  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() updateFingerprintDto: UpdateOneFingerprintRequest): Promise<UpdateOneFingerprintResponse> {
    await this.service.update(+id, updateFingerprintDto);
    return { data: null }
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string): Promise<RemoveOneFingerprintResponse> {
    const deletedId = await this.service.remove(+id);
    return { data: deletedId }
  }
}
