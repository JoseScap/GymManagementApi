import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MemberStatus } from "../enums/member.enum";
import { Subscription } from "src/subscriptions/entities/subscription.entity";
import { Fingerprint } from "src/fingerprints/entities/fingerprint.entity";

@Entity('members')
export class Member {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    fullName: string;

    @Column({ length: 15, nullable: true })
    phoneNumber: string | null;

    @Column({
        type: 'enum',
        enum: MemberStatus,
        default: MemberStatus.Inactivo
    })
    currentStatus: MemberStatus;

    @Column({ length: 20, unique: true })
    dni: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToOne(() => Fingerprint, fingerprint => fingerprint.member)
    fingerprint: Fingerprint;
    
    @OneToMany(() => Subscription, subscription => subscription.member)
    subscriptions: Subscription[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

