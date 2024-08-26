import { Controller, Get } from '@nestjs/common';
import { SummariesService } from './summaries.service';

@Controller('summaries')
export class SummariesController {
    constructor(private readonly summariesService: SummariesService) {}

    @Get()
    getToday()
    {
        return this.summariesService.getByDate(new Date())
    }
}
