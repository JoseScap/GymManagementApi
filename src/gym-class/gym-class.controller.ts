import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GymClassService } from './gym-class.service';
import { CreateGymClassRequest } from './dto/request/create-gymClass.request';
import { CreateOneGymClassResponse } from './dto/response/create-gymClass.response';
import { RemoveGymClassResponse } from './dto/response/remove-gymClass.response';
import { UpdateGymClassRequest } from './dto/request/update-gymClass.request';

@Controller('classes')
export class GymClassController {
  constructor(private readonly gymClassService: GymClassService) {}

  @Post('create-one')
  async create(@Body() CreateGymClassRequest: CreateGymClassRequest): Promise<CreateOneGymClassResponse> {
    await this.gymClassService.create(CreateGymClassRequest);
    return { data: null }
  }

  @Get()
  findAll() {
    return this.gymClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gymClassService.findOne(+id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateGymClassRequest: UpdateGymClassRequest) {
    await this.gymClassService.update(id, updateGymClassRequest);
    return { data: null }
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string): Promise<RemoveGymClassResponse> {
    await this.gymClassService.removeOrRestore({ id, changeTo: true });
    return { data: null }
  }

  @Delete('restore/:id')
  async restore(@Param('id') id: string): Promise<RemoveGymClassResponse> {
    await this.gymClassService.removeOrRestore({ id, changeTo: false });
    return { data: null }
  }
}
