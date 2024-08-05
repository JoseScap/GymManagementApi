import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MembersService } from './members.service';
import { FindPaginatedResponse } from './dto/response/find-paginated.response';
import { SingleApiResponse } from 'src/types/ApiResponse';
import { FindOneResponse } from './dto/response/find-one.response';
import { CreateMemberRequest } from './dto/request/create-member.request';
import { UpdateMemberRequest } from './dto/request/update-member.request';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberRequest) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findPaginated(@Query('page') page: string): Promise<FindPaginatedResponse> {
    const parsedPage = Number(page)
    const sanitizedPage = isNaN(parsedPage) ? 1 : parsedPage

    return this.membersService.findPaginated(sanitizedPage);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindOneResponse> {
    const data = await this.membersService.findOne(id);
    return { data }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberRequest) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }
}
