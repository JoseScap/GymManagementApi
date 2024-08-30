import { BadRequestException, Controller, Get, Post, Query } from '@nestjs/common';
import { SummariesService } from './summaries.service';

@Controller('summaries')
export class SummariesController {
    constructor(private readonly summariesService: SummariesService) {}

    @Get()
    getToday()
    {
        return this.summariesService.getToday()
    }

    @Get('day')
    getDay(@Query('day') day: string)
    {
        if (!day) throw new BadRequestException('Parameter day is required')

        return this.summariesService.getDay(new Date(day))
    }

    @Get('week')
    getWeek(@Query('day') day: string)
    {
        if (!day) throw new BadRequestException('Parameter day is required')

        return this.summariesService.getWeek(new Date(day))
    }

    @Post()
    signToday()
    {
        return this.summariesService.signToday();    
    }
}
