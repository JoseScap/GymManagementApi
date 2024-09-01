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
import { WEEK_STARTS_ON } from 'src/common/constants';

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

        const newCashSubs = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count = 1')
            .andWhere('ss.isCanceled = 0')
            .andWhere("ss.paymentMethod = 'Efectivo'")
            .groupBy('DATE(ss.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedSubSummary>();

        const newTransferSubs = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count = 1')
            .andWhere('ss.isCanceled = 0')
            .andWhere("ss.paymentMethod = 'Transferencia'")
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

        const newCanceledCashSubs = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count = 1')
            .andWhere('ss.isCanceled = 1')
            .andWhere("ss.paymentMethod = 'Efectivo'")
            .groupBy('DATE(ss.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedSubSummary>();

        const newCanceledTransferSubs = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count = 1')
            .andWhere('ss.isCanceled = 1')
            .andWhere("ss.paymentMethod = 'Transferencia'")
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

        const cashRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count > 1')
            .andWhere('ss.isCanceled = 0')
            .andWhere("ss.paymentMethod = 'Efectivo'")
            .groupBy('DATE(ss.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedSubSummary>();

        const transferRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count > 1')
            .andWhere('ss.isCanceled = 0')
            .andWhere("ss.paymentMethod = 'Transferencia'")
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

        const canceledCashRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count > 1')
            .andWhere('ss.isCanceled = 1')
            .andWhere("ss.paymentMethod = 'Efectivo'")
            .groupBy('DATE(ss.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedSubSummary>();

        const canceledTransferRenewals = await this.subSummaryRepository.createQueryBuilder('ss')
            .select('DATE(ss.createdAt)', 'date')
            .addSelect('SUM(ss.amount)', 'totalAmount')
            .addSelect('COUNT(ss.id)', 'count')
            .where('ss.previous_count > 1')
            .andWhere('ss.isCanceled = 1')
            .andWhere("ss.paymentMethod = 'Transferencia'")
            .groupBy('DATE(ss.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedSubSummary>();

        const gymClasses = await this.ggccRepository.createQueryBuilder('ggcc')
            .select('DATE(ggcc.createdAt)', 'date')
            .addSelect('SUM(ggcc.total)', 'total')
            .addSelect('SUM(ggcc.transferTotal)', 'transferTotal')
            .addSelect('COUNT(ggcc.id)', 'count')
            .where('ggcc.isCanceled = 0')
            .groupBy('DATE(ggcc.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedGgccSummary>()

        const canceledGymClasses = await this.ggccRepository.createQueryBuilder('ggcc')
            .select('DATE(ggcc.createdAt)', 'date')
            .addSelect('SUM(ggcc.total)', 'total')
            .addSelect('COUNT(ggcc.id)', 'count')
            .addSelect('SUM(ggcc.transferTotal)', 'transferTotal')
            .where('ggcc.isCanceled = 1')
            .groupBy('DATE(ggcc.createdAt)')
            .having('date = DATE(CURDATE())')
            .getRawMany<GroupedGgccSummary>()

        // Cash totals
        const newSubsCashTotal = +(newCashSubs[0]?.totalAmount ?? 0)
        const renewalsCashTotal = +(cashRenewals[0]?.totalAmount ?? 0)
        const gymClassesCashTotal = +(gymClasses[0]?.total ?? 0) - (+(gymClasses[0]?.transferTotal ?? 0))
        const totalCashIncome = newSubsCashTotal + renewalsCashTotal + gymClassesCashTotal

        // Transfer totals
        const newSubsTransferTotal = +(newTransferSubs[0]?.totalAmount ?? 0)
        const renewalsTransferTotal = +(transferRenewals[0]?.totalAmount ?? 0)
        const gymClassesTransferTotal = +(gymClasses[0]?.transferTotal ?? 0)
        const totalTransferIncome = newSubsTransferTotal + renewalsTransferTotal + gymClassesTransferTotal

        const totalIncome = (+(newSubs[0]?.totalAmount ?? 0)) + (+(renewals[0]?.totalAmount ?? 0)) + (+(gymClasses[0]?.total ?? 0))

        return {
            newMembersCount: +(newSubs[0]?.count ?? 0),
            newMembersIncome: +(newSubs[0]?.totalAmount ?? 0),
            newMembersCashIncome: +(newCashSubs[0]?.totalAmount ?? 0),
            newMembersTransferIncome: +(newTransferSubs[0]?.totalAmount ?? 0),
            newMembersCanceledCount: +(newCanceledSubs[0]?.count ?? 0),
            newMembersCanceledIncome: +(newCanceledSubs[0]?.totalAmount ?? 0),
            newMembersCanceledCashIncome: +(newCanceledCashSubs[0]?.totalAmount ?? 0),
            newMembersCanceledTransferIncome: +(newCanceledTransferSubs[0]?.totalAmount ?? 0),
            renewedMembersCount: +(renewals[0]?.count ?? 0),
            renewedMembersIncome: +(renewals[0]?.totalAmount ?? 0),
            renewedMembersCashIncome: +(cashRenewals[0]?.totalAmount ?? 0),
            renewedMembersTransferIncome: +(transferRenewals[0]?.totalAmount ?? 0),
            renewedMembersCanceledCount: +(canceledRenewals[0]?.count ?? 0),
            renewedMembersCanceledIncome: +(canceledRenewals[0]?.totalAmount ?? 0),
            renewedMembersCanceledCashIncome: +(canceledCashRenewals[0]?.totalAmount ?? 0),
            renewedMembersCanceledTransferIncome: +(canceledTransferRenewals[0]?.totalAmount ?? 0),
            gymClassesCount: +(gymClasses[0]?.count ?? 0),
            gymClassesIncome: +(gymClasses[0]?.total ?? 0),
            gymClassesCashIncome: +(gymClasses[0]?.total ?? 0) - (+(gymClasses[0]?.transferTotal ?? 0)),
            gymClassesTransferIncome: +(gymClasses[0]?.transferTotal ?? 0),
            gymClassesCanceledCount: +(canceledGymClasses[0]?.count ?? 0),
            gymClassesCanceledIncome: +(canceledGymClasses[0]?.total ?? 0),
            gymClassesCanceledCashIncome: +(canceledGymClasses[0]?.total ?? 0) - (+(canceledGymClasses[0]?.transferTotal ?? 0)),
            gymClassesCanceledTransferIncome: +(canceledGymClasses[0]?.transferTotal ?? 0),
            totalIncome,
            totalCashIncome,
            totalTransferIncome
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
            .addSelect('SUM(ss.newMembersCashIncome)', 'newMembersCashIncome')
            .addSelect('SUM(ss.newMembersTransferIncome)', 'newMembersTransferIncome')
            .addSelect('SUM(ss.newMembersCanceledCount)', 'newMembersCanceledCount')
            .addSelect('SUM(ss.newMembersCanceledIncome)', 'newMembersCanceledIncome')
            .addSelect('SUM(ss.newMembersCanceledCashIncome)', 'newMembersCanceledCashIncome')
            .addSelect('SUM(ss.newMembersCanceledTransferIncome)', 'newMembersCanceledTransferIncome')
            .addSelect('SUM(ss.renewedMembersCount)', 'renewedMembersCount')
            .addSelect('SUM(ss.renewedMembersIncome)', 'renewedMembersIncome')
            .addSelect('SUM(ss.renewedMembersCashIncome)', 'renewedMembersCashIncome')
            .addSelect('SUM(ss.renewedMembersTransferIncome)', 'renewedMembersTransferIncome')
            .addSelect('SUM(ss.renewedMembersCanceledCount)', 'renewedMembersCanceledCount')
            .addSelect('SUM(ss.renewedMembersCanceledIncome)', 'renewedMembersCanceledIncome')
            .addSelect('SUM(ss.renewedMembersCanceledCashIncome)', 'renewedMembersCanceledCashIncome')
            .addSelect('SUM(ss.renewedMembersCanceledTransferIncome)', 'renewedMembersCanceledTransferIncome')
            .addSelect('SUM(ss.gymClassesCount)', 'gymClassesCount')
            .addSelect('SUM(ss.gymClassesIncome)', 'gymClassesIncome')
            .addSelect('SUM(ss.gymClassesCashIncome)', 'gymClassesCashIncome')
            .addSelect('SUM(ss.gymClassesTransferIncome)', 'gymClassesTransferIncome')
            .addSelect('SUM(ss.gymClassesCanceledCount)', 'gymClassesCanceledCount')
            .addSelect('SUM(ss.gymClassesCanceledIncome)', 'gymClassesCanceledIncome')
            .addSelect('SUM(ss.gymClassesCanceledCashIncome)', 'gymClassesCanceledCashIncome')
            .addSelect('SUM(ss.gymClassesCanceledTransferIncome)', 'gymClassesCanceledTransferIncome')
            .addSelect('SUM(ss.totalIncome)', 'totalIncome')
            .addSelect('SUM(ss.totalCashIncome)', 'totalCashIncome')
            .addSelect('SUM(ss.totalTransferIncome)', 'totalTransferIncome')
            .addSelect('SUM(ss.totalCanceled)', 'totalCanceled')
            .addSelect('SUM(ss.totalAmount)', 'totalAmount')
            .where('ss.year = :year AND ss.week = :week', { year: getYear(date), week: getWeek(date, { weekStartsOn: WEEK_STARTS_ON }) })
            .groupBy('CONCAT(ss.year, ss.week)')
            .getRawMany<GroupedWeekSummary>()

        if (summaries === null || summaries.length === 0) throw new NotFoundException()

        return summaries[0]
    }

    async getMonth(date: Date) {
        const summaries = await this.summaryRepository.createQueryBuilder('ss')
            .select('SUM(ss.newMembersCount)', 'newMembersCount')
            .addSelect('SUM(ss.newMembersIncome)', 'newMembersIncome')
            .addSelect('SUM(ss.newMembersCashIncome)', 'newMembersCashIncome')
            .addSelect('SUM(ss.newMembersTransferIncome)', 'newMembersTransferIncome')
            .addSelect('SUM(ss.newMembersCanceledCount)', 'newMembersCanceledCount')
            .addSelect('SUM(ss.newMembersCanceledIncome)', 'newMembersCanceledIncome')
            .addSelect('SUM(ss.newMembersCanceledCashIncome)', 'newMembersCanceledCashIncome')
            .addSelect('SUM(ss.newMembersCanceledTransferIncome)', 'newMembersCanceledTransferIncome')
            .addSelect('SUM(ss.renewedMembersCount)', 'renewedMembersCount')
            .addSelect('SUM(ss.renewedMembersIncome)', 'renewedMembersIncome')
            .addSelect('SUM(ss.renewedMembersCashIncome)', 'renewedMembersCashIncome')
            .addSelect('SUM(ss.renewedMembersTransferIncome)', 'renewedMembersTransferIncome')
            .addSelect('SUM(ss.renewedMembersCanceledCount)', 'renewedMembersCanceledCount')
            .addSelect('SUM(ss.renewedMembersCanceledIncome)', 'renewedMembersCanceledIncome')
            .addSelect('SUM(ss.renewedMembersCanceledCashIncome)', 'renewedMembersCanceledCashIncome')
            .addSelect('SUM(ss.renewedMembersCanceledTransferIncome)', 'renewedMembersCanceledTransferIncome')
            .addSelect('SUM(ss.gymClassesCount)', 'gymClassesCount')
            .addSelect('SUM(ss.gymClassesIncome)', 'gymClassesIncome')
            .addSelect('SUM(ss.gymClassesCashIncome)', 'gymClassesCashIncome')
            .addSelect('SUM(ss.gymClassesTransferIncome)', 'gymClassesTransferIncome')
            .addSelect('SUM(ss.gymClassesCanceledCount)', 'gymClassesCanceledCount')
            .addSelect('SUM(ss.gymClassesCanceledIncome)', 'gymClassesCanceledIncome')
            .addSelect('SUM(ss.gymClassesCanceledCashIncome)', 'gymClassesCanceledCashIncome')
            .addSelect('SUM(ss.gymClassesCanceledTransferIncome)', 'gymClassesCanceledTransferIncome')
            .addSelect('SUM(ss.totalIncome)', 'totalIncome')
            .addSelect('SUM(ss.totalCashIncome)', 'totalCashIncome')
            .addSelect('SUM(ss.totalTransferIncome)', 'totalTransferIncome')
            .addSelect('SUM(ss.totalCanceled)', 'totalCanceled')
            .addSelect('SUM(ss.totalAmount)', 'totalAmount')
            .where('ss.year = :year AND ss.month = :month', { year: getYear(date), month: getMonth(date) + 1 })
            .groupBy('CONCAT(ss.year, ss.month)')
            .getRawMany<GroupedWeekSummary>()

        if (summaries === null || summaries.length === 0) throw new NotFoundException()

        return summaries[0]
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
            week: getWeek(currentDate, { weekStartsOn: WEEK_STARTS_ON }),
            month: getMonth(currentDate) + 1,
            year: getYear(currentDate),
            newMembersCount: data.newMembersCount,
            newMembersIncome: data.newMembersIncome,
            newMembersCashIncome: data.newMembersCashIncome,
            newMembersTransferIncome: data.newMembersTransferIncome,
            newMembersCanceledCount: data.newMembersCanceledCount,
            newMembersCanceledIncome: data.newMembersCanceledIncome,
            newMembersCanceledCashIncome: data.newMembersCanceledCashIncome,
            newMembersCanceledTransferIncome: data.newMembersCanceledTransferIncome,
            renewedMembersCount: data.renewedMembersCount,
            renewedMembersIncome: data.renewedMembersIncome,
            renewedMembersCashIncome: data.renewedMembersCashIncome,
            renewedMembersTransferIncome: data.renewedMembersTransferIncome,
            renewedMembersCanceledCount: data.renewedMembersCanceledCount,
            renewedMembersCanceledIncome: data.renewedMembersCanceledIncome,
            renewedMembersCanceledCashIncome: data.renewedMembersCanceledCashIncome,
            renewedMembersCanceledTransferIncome: data.renewedMembersCanceledTransferIncome,
            gymClassesCount: data.gymClassesCount,
            gymClassesIncome: data.gymClassesIncome,
            gymClassesCashIncome: data.gymClassesCashIncome,
            gymClassesTransferIncome: data.gymClassesTransferIncome,
            gymClassesCanceledCount: data.gymClassesCanceledCount,
            gymClassesCanceledIncome: data.gymClassesCanceledIncome,
            gymClassesCanceledCashIncome: data.gymClassesCanceledCashIncome,
            gymClassesCanceledTransferIncome: data.gymClassesCanceledTransferIncome,
            totalCanceled: data.newMembersCanceledIncome + data.renewedMembersCanceledIncome + data.gymClassesCanceledIncome,
            totalIncome: data.totalIncome,
            totalCashIncome: data.totalCashIncome,
            totalTransferIncome: data.totalTransferIncome,
            totalAmount: data.newMembersIncome + data.renewedMembersIncome + data.gymClassesIncome,
        });
    
        return await this.summaryRepository.save(summary);
    }
    
}
