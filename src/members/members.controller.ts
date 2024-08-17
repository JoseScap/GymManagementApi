import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseBoolPipe } from '@nestjs/common';
import { MembersService } from './members.service';
import { FindPaginatedMemberResponse } from './dto/response/find-paginated.response';
import { FindOneMemberResponse } from './dto/response/find-one.response';
import { CreateMemberRequest } from './dto/request/create-member.request';
import { UpdateMemberRequest } from './dto/request/update-member.request';
import { CreateOneMemberResponse } from './dto/response/create-one.response';
import { UpdateMemberResponse } from './dto/response/update-member.response';
import { RemoveMemberResponse } from './dto/response/remove-member.response';
import { RestoreMemberResponse } from './dto/response/restore-member.response';
import { FindPaginatedMemberQuery } from './dto/query/find-paginated.query';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async createOne(@Body() createMemberRequest: CreateMemberRequest): Promise<CreateOneMemberResponse> {
    await this.membersService.create(createMemberRequest);
    return { data: null }
  }

  @Get()
  findPaginated(
    @Query() query: FindPaginatedMemberQuery
  ): Promise<FindPaginatedMemberResponse> {
    const { page, embedSubscriptions, currentStatus } = query;

    const parsedPage = Number(page)
    const sanitizedPage = isNaN(parsedPage) ? 1 : parsedPage

    return this.membersService.findPaginated(sanitizedPage, embedSubscriptions === 'true', currentStatus);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('embedSubscriptions', ParseBoolPipe) embedSubscriptions: boolean
  ): Promise<FindOneMemberResponse> {
    const data = await this.membersService.findOne(id, embedSubscriptions);
    return { data }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberRequest): Promise<UpdateMemberResponse> {
    await this.membersService.update(id, updateMemberDto);
    return { data: null }
  }

  @Delete(':id')
  async remove(@Param('id') id: string ): Promise<RemoveMemberResponse> {
    await this.membersService.removeOrRestore({ id, changeTo: false});
    return { data: null }
  }

  @Post(':id')
  async restore(@Param('id') id: string ): Promise<RestoreMemberResponse> {
    await this.membersService.removeOrRestore({ id, changeTo: true });
    return { data: null }
  }
}
