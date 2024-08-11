import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { PaymentMethod } from "../enums/subscription.enum";
import { Member } from "src/members/entities/member.entity";
import { ActiveMemberStatus } from "src/members/enums/member.enum";

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @Column()
    dateFrom: Date;

    @Column()
    dateTo: Date;

    @Column({ default: false })
    isCanceled: boolean;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.Efectivo
    })
    paymentMethod: PaymentMethod;

    @Column({
        type: 'enum',
        enum: ActiveMemberStatus,
        nullable: false
    })
    status: ActiveMemberStatus;

    @Column({ length : 36 })
    memberId: string;

    @ManyToOne(() => Member, member => member.subscriptions)
    member: Member;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
