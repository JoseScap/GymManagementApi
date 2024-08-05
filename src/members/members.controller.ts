import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MembersService } from './members.service';
import { FindPaginatedMemberResponse } from './dto/response/find-paginated.response';
import { SingleApiResponse } from 'src/types/ApiResponse';
import { FindOneMemberResponse } from './dto/response/find-one.response';
import { CreateMemberRequest } from './dto/request/create-member.request';
import { UpdateMemberRequest } from './dto/request/update-member.request';
import { CreateOneMemberResponse } from './dto/response/create-one.response';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async createOne(@Body() createMemberDto: CreateMemberRequest): Promise<CreateOneMemberResponse> {
    await this.membersService.create(createMemberDto);
    return { data: null }
  }

  @Get()
  findPaginated(@Query('page') page: string): Promise<FindPaginatedMemberResponse> {
    const parsedPage = Number(page)
    const sanitizedPage = isNaN(parsedPage) ? 1 : parsedPage

    return this.membersService.findPaginated(sanitizedPage);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindOneMemberResponse> {
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
