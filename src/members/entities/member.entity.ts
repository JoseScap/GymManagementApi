import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MemberStatus } from "../enums/member.enum";

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

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}

