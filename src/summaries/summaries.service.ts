import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionSummary } from './entities/subscription_summary.view';
import { Repository } from 'typeorm';

@Injectable()
export class SummariesService {
    constructor(
        @InjectRepository(SubscriptionSummary)
        private subSummaryRepository: Repository<SubscriptionSummary>
    ) { }

    async getByDate(date: Date) {
        const formattedDate = date.toISOString().split('T')[0]; // Formatea la fecha en 'YYYY-MM-DD'
    
        const newSubs = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .where('DATE(ss.createdAt) = :date', { date: formattedDate })
            .andWhere('ss.previous_count = 1')
            .groupBy('DATE(ss.createdAt)')
            .getRawMany();
    
        const renewals = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .where('DATE(ss.createdAt) = :date', { date: formattedDate })
            .andWhere('ss.previous_count > 1')
            .groupBy('DATE(ss.createdAt)')
            .getRawMany();
    
        return {
            newSubs,
            renewals
        };
    }
    
}
