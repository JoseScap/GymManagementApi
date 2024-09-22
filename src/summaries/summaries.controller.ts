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

    @Get('lastDay')
    getLastDay()
    {
        return this.summariesService.getLastDay()
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

    @Get('month')
    getMonth(@Query('day') day: string)
    {
        if (!day) throw new BadRequestException('Parameter day is required')

        return this.summariesService.getMonth(new Date(day))
    }

    @Get('verify')
    verifyLastDay()
    {
        return this.summariesService.verifyLastDay()
    }

    @Post()
    signToday()
    {
        return this.summariesService.signToday();    
    }

    @Post('lastDay')
    signLastDay()
    {
        return this.summariesService.signLastDay();    
    }
}
