import { Injectable } from '@nestjs/common';

@Injectable()
export class GymLoggerService {
    public log(...messages: any[]) {
        const timestamp = new Date().toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
        console.log('[Cronos]:', timestamp, ...messages);
    }
}
