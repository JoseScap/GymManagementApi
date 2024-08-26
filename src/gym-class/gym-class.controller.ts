import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GymClassService } from './gym-class.service';
import { CreateGymClassRequest } from './dto/request/create-gymClass.request';
import { UpdateGymClassDto } from './dto/update-gym-class.dto';
import { CreateOneGymClassResponse } from './dto/response/create-gymClass.response';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGymClassDto: UpdateGymClassDto) {
    return this.gymClassService.update(+id, updateGymClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gymClassService.remove(+id);
  }
}
