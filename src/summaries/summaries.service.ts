import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionSummary } from './entities/subscription_summary.view';
import { Repository } from 'typeorm';
import { GymClassSummary } from './entities/gym_class_summary.view';
import { GroupedSubSummary } from './entities/grouped_sub_summary.view';
import { Summary } from './entities/summary.entity';
import { getDate, getMonth, getWeek, getYear } from 'date-fns';

@Injectable()
export class SummariesService {
    constructor(
        @InjectRepository(SubscriptionSummary)
        private subSummaryRepository: Repository<SubscriptionSummary>,
        @InjectRepository(GymClassSummary)
        private ggccSummaryRepository: Repository<GymClassSummary>,
        @InjectRepository(Summary)
        private summaryRepository: Repository<Summary>
    ) { }

    async getToday() {
        const newSubs = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .where('DATE(ss.createdAt) = CURDATE()')
            .andWhere('ss.previous_count = 1')
            .groupBy('DATE(ss.createdAt)')
            .getRawMany<GroupedSubSummary>();

        const newSubsCount = await this.subSummaryRepository.createQueryBuilder('ss')
            .where('DATE(ss.createdAt) = CURDATE()')
            .andWhere('ss.previous_count = 1')
            .getCount();
    
        const renewals = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .where('DATE(ss.createdAt) = CURDATE()')
            .andWhere('ss.previous_count > 1')
            .groupBy('DATE(ss.createdAt)')
            .getRawMany<GroupedSubSummary>();

        const renewalsCount = await this.subSummaryRepository.createQueryBuilder('ss')
            .where('DATE(ss.createdAt) = CURDATE()')
            .andWhere('ss.previous_count > 1')
            .getCount();

        const classes = await this.ggccSummaryRepository.createQueryBuilder('ggcc')
            .where('DATE(createdAt) = CURDATE()')
            .getMany();

        return {
            newMembersCount: newSubsCount,
            newMembersIncome: newSubs[0].totalAmount,
            renewedMembersCount: renewalsCount,
            renewedMembersIncome: renewals[0].totalAmount,
            gymClassesCount: classes[0].classes_count,
            gymClassesIncome: classes[0].total,
        };
    }
    
    async signToday() {
        const data = await this.getToday();
        const currentDate = new Date();
    
        const summary = this.summaryRepository.create({
            day: getDate(currentDate),
            week: getWeek(currentDate, { weekStartsOn: 1 }),
            month: getMonth(currentDate) + 1,
            year: getYear(currentDate),
            newMembersCount: data.newMembersCount,
            newMembersIncome: data.newMembersIncome,
            renewedMembersCount: data.renewedMembersCount,
            renewedMembersIncome: data.renewedMembersIncome,
            gymClassesCount: data.gymClassesCount,
            gymClassesIncome: data.gymClassesIncome
        });
    
        return await this.summaryRepository.save(summary);
    }
    
}
