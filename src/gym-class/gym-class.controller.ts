import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GymClassService } from './gym-class.service';
import { CreateGymClassRequest } from './dto/request/create-gymClass.request';
import { CreateOneGymClassResponse } from './dto/response/create-gymClass.response';
import { RemoveGymClassResponse } from './dto/response/remove-gymClass.response';
import { UpdateGymClassRequest } from './dto/request/update-gymClass.request';
import { FindOneGymClass } from './dto/response/findOne-gymClass.response';
import { FindPaginatedGymClassResponse } from './dto/response/find-paginated.response';

@Controller('classes')
export class GymClassController {
  constructor(private readonly gymClassService: GymClassService) {}

  @Post('create-one')
  async create(@Body() CreateGymClassRequest: CreateGymClassRequest): Promise<CreateOneGymClassResponse> {
    await this.gymClassService.create(CreateGymClassRequest);
    return { data: null }
  }

  @Get('find-paginated')
  async findPaginated(
    @Query('page') page: string
  ): Promise<FindPaginatedGymClassResponse> {
    const parsedPage = Number(page);
    const sanitizedPage = isNaN(parsedPage) ? 1 : parsedPage

    return this.gymClassService.findPaginated(sanitizedPage);
  }

  @Get('find-one/:id')
  async findOne(@Param('id') id: string): Promise<FindOneGymClass> {
    const data = await this.gymClassService.findOne(id);
    return { data }
  }

  @Get('find-by-name/:className')
  async findByName(
    @Param('className') className: string,
    @Query('page') page: string
  ): Promise<FindPaginatedGymClassResponse> {
    const data = await this.gymClassService.findByName(+page, className);
    return data
  }

  @Get('find-by-date/:date')
  async findByDate(
    @Param('date') date: Date,
    @Query('page') page: string
  ): Promise<FindPaginatedGymClassResponse> {
    const data = await this.gymClassService.findByDate(+page, date);
    return data
  }

  @Get('find-by-professor/:professor')
  async findByProfessor(
    @Param('professor') professor: string,
    @Query('page') page: string
  ): Promise<FindPaginatedGymClassResponse> {
    const data = await this.gymClassService.findByProfessor(+page, professor);
    return data
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
