import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionSummary } from './entities/subscription_summary.view';
import { Repository } from 'typeorm';
import { GroupedSubSummary } from './entities/grouped_sub_summary.view';
import { Summary } from './entities/summary.entity';
import { getDate, getMonth, getWeek, getYear } from 'date-fns';
import { GymClass } from 'src/gym-class/entities/gym-class.entity';
import { GroupedGgccSummary } from './entities/grouped_ggcc_summary.view';
import { GroupedWeekSummary } from './entities/grouped_week_summary.view';

@Injectable()
export class SummariesService {
    constructor(
        @InjectRepository(SubscriptionSummary)
        private subSummaryRepository: Repository<SubscriptionSummary>,
        @InjectRepository(GymClass)
        private ggccRepository: Repository<GymClass>,
        @InjectRepository(Summary)
        private summaryRepository: Repository<Summary>
    ) { }

    async getToday() {
        const newSubs = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count = 1')
            .andWhere('ss.isCanceled = 0')
            .groupBy('DATE(ss.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedSubSummary>();

        const newCanceledSubs = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count = 1')
            .andWhere('ss.isCanceled = 1')
            .groupBy('DATE(ss.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedSubSummary>();
    
        const renewals = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count > 1')
            .andWhere('ss.isCanceled = 0')
            .groupBy('DATE(ss.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedSubSummary>();
        
        const canceledRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count > 1')
            .andWhere('ss.isCanceled = 1')
            .groupBy('DATE(ss.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedSubSummary>();

        const gymClasses = await this.ggccRepository.createQueryBuilder('ggcc')
            .select('DATE(ggcc.createdAt)', 'date')
            .addSelect('SUM(ggcc.total)', 'total')
            .addSelect('COUNT(ggcc.id)', 'count')
            .where('ggcc.isCanceled = 0')
            .groupBy('DATE(ggcc.createdAt)')
            .getRawMany<GroupedGgccSummary>()

        const canceledGymClasses = await this.ggccRepository.createQueryBuilder('ggcc')
            .select('DATE(ggcc.createdAt)', 'date')
            .addSelect('SUM(ggcc.total)', 'total')
            .addSelect('COUNT(ggcc.id)', 'count')
            .where('ggcc.isCanceled = 1')
            .groupBy('DATE(ggcc.createdAt)')
            .getRawMany<GroupedGgccSummary>()

        return {
            newMembersCount: +(newSubs[0]?.count ?? 0),
            newMembersIncome: +(newSubs[0]?.totalAmount ?? 0),
            newMembersCanceledCount: +(newCanceledSubs[0]?.count ?? 0),
            newMembersCanceledIncome: +(newCanceledSubs[0]?.totalAmount ?? 0),
            renewedMembersCount: +(renewals[0]?.count ?? 0),
            renewedMembersIncome: +(renewals[0]?.totalAmount ?? 0),
            renewedMembersCanceledCount: +(canceledRenewals[0]?.count ?? 0),
            renewedMembersCanceledIncome: +(canceledRenewals[0]?.totalAmount ?? 0),
            gymClassesCount: +(gymClasses[0]?.count ?? 0),
            gymClassesIncome: +(gymClasses[0]?.total ?? 0),
            gymClassesCanceledCount: +(canceledGymClasses[0]?.count ?? 0),
            gymClassesCanceledIncome: +(canceledGymClasses[0]?.total ?? 0),
            totalIncome: (+newSubs[0].totalAmount) + (+renewals[0].totalAmount) + (+gymClasses[0].total)
        };
    }

    async getDay(date: Date) {
        const summary = await this.summaryRepository.findOne({
            where: {
                day: getDate(date),
                month: getMonth(date) + 1,
                year: getYear(date),
            }
        });

        if (!summary) throw new NotFoundException()

        return summary
    }

    async getWeek(date: Date) {
        const summaries = await this.summaryRepository.createQueryBuilder('ss')
            .select('SUM(ss.newMembersCount)', 'newMembersCount')
            .addSelect('SUM(ss.newMembersIncome)', 'newMembersIncome')
            .addSelect('SUM(ss.newMembersCanceledCount)', 'newMembersCanceledCount')
            .addSelect('SUM(ss.newMembersCanceledIncome)', 'newMembersCanceledIncome')
            .addSelect('SUM(ss.renewedMembersCount)', 'renewedMembersCount')
            .addSelect('SUM(ss.renewedMembersIncome)', 'renewedMembersIncome')
            .addSelect('SUM(ss.renewedMembersCanceledCount)', 'renewedMembersCanceledCount')
            .addSelect('SUM(ss.renewedMembersCanceledIncome)', 'renewedMembersCanceledIncome')
            .addSelect('SUM(ss.gymClassesCount)', 'gymClassesCount')
            .addSelect('SUM(ss.gymClassesIncome)', 'gymClassesIncome')
            .addSelect('SUM(ss.gymClassesCanceledCount)', 'gymClassesCanceledCount')
            .addSelect('SUM(ss.gymClassesCanceledIncome)', 'gymClassesCanceledIncome')
            .addSelect('SUM(ss.totalIncome)', 'totalIncome')
            .addSelect('SUM(ss.totalCanceled)', 'totalCanceled')
            .addSelect('SUM(ss.totalAmount)', 'totalAmount')
            .groupBy('CONCAT(ss.year, ss.week)')
            .getRawMany<GroupedWeekSummary>()

        if (summaries === null) throw new NotFoundException()

        return summaries[0] ?? []
    }
    
    async signToday() {
        const data = await this.getToday();
        const currentDate = new Date();

        const prevSummary = await this.summaryRepository.findOne({
            where: {
                day: getDate(currentDate),
                month: getMonth(currentDate) + 1,
                year: getYear(currentDate),
            }
        });

        if (prevSummary != null) {
            await this.summaryRepository.remove(prevSummary)
        }
    
        const summary = this.summaryRepository.create({
            day: getDate(currentDate),
            week: getWeek(currentDate, { weekStartsOn: 1 }),
            month: getMonth(currentDate) + 1,
            year: getYear(currentDate),
            newMembersCount: data.newMembersCount,
            newMembersIncome: data.newMembersIncome,
            newMembersCanceledCount: data.newMembersCanceledCount,
            newMembersCanceledIncome: data.newMembersCanceledIncome,
            renewedMembersCount: data.renewedMembersCount,
            renewedMembersIncome: data.renewedMembersIncome,
            renewedMembersCanceledCount: data.renewedMembersCanceledCount,
            renewedMembersCanceledIncome: data.renewedMembersCanceledIncome,
            gymClassesCount: data.gymClassesCount,
            gymClassesIncome: data.gymClassesIncome,
            gymClassesCanceledCount: data.gymClassesCanceledCount,
            gymClassesCanceledIncome: data.gymClassesCanceledIncome,
            totalCanceled: data.newMembersCanceledIncome + data.renewedMembersCanceledIncome + data.gymClassesCanceledIncome,
            totalIncome: data.newMembersIncome + data.renewedMembersIncome + data.gymClassesIncome,
            totalAmount: data.newMembersIncome + data.renewedMembersIncome + data.gymClassesIncome,
        });
    
        return await this.summaryRepository.save(summary);
    }
    
}
