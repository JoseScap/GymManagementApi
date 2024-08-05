import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestsService } from './tests.service';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get()
  findAll() {
    return this.testsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(id);
  }
}
