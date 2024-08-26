import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionSummary } from './entities/subscription_summary.view';
import { Repository } from 'typeorm';
import { GymClassSummary } from './entities/gym_class_summary.view';

@Injectable()
export class SummariesService {
    constructor(
        @InjectRepository(SubscriptionSummary)
        private subSummaryRepository: Repository<SubscriptionSummary>,
        @InjectRepository(SubscriptionSummary)
        private ggccSummaryRepository: Repository<GymClassSummary>
    ) { }

    async getToday() {
        const newSubs = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .where('DATE(ss.createdAt) = CURDATE()')
            .andWhere('ss.previous_count = 1')
            .groupBy('DATE(ss.createdAt)')
            .getRawMany();
    
        const renewals = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .where('DATE(ss.createdAt) = CURDATE()')
            .andWhere('ss.previous_count > 1')
            .groupBy('DATE(ss.createdAt)')
            .getRawMany();

        const classes = await this.ggccSummaryRepository.createQueryBuilder('ggcc')
            .where('DATE(createdAt) = CURDATE()')
            .getMany();

        return {
            newSubs,
            renewals,
            classes
        };
    }
    
}
