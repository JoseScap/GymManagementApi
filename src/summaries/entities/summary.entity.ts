import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('summaries')
export class Summary {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    day: number;

    @Column()
    week: number;

    @Column()
    month: number;

    @Column()
    year: number;

    @Column({ type: 'int', default: 0 })
    newMembersCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    newMembersIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    newMembersCashIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    newMembersTransferIncome: number;

    @Column({ type: 'int', default: 0 })
    newMembersCanceledCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    newMembersCanceledIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    newMembersCanceledCashIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    newMembersCanceledTransferIncome: number;

    @Column({ type: 'int', default: 0 })
    renewedMembersCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    renewedMembersIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    renewedMembersCashIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    renewedMembersTransferIncome: number;

    @Column({ type: 'int', default: 0 })
    renewedMembersCanceledCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    renewedMembersCanceledIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    renewedMembersCanceledCashIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    renewedMembersCanceledTransferIncome: number;

    @Column({ type: 'int', default: 0 })
    gymClassesCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    gymClassesIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    gymClassesCashIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    gymClassesTransferIncome: number;

    @Column({ type: 'int', default: 0 })
    gymClassesCanceledCount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    gymClassesCanceledIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    gymClassesCanceledCashIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    gymClassesCanceledTransferIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalCashIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalTransferIncome: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalCanceled: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ type: 'boolean', default: false })
    isModified: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
