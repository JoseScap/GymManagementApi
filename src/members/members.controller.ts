import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { FindPaginatedResponse } from './dto/response/find-paginated.response';
import { SingleApiResponse } from 'src/types/ApiResponse';
import { FindOneResponse } from './dto/response/find-one.response';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
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
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }
}
