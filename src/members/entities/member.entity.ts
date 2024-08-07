import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { MemberStatus } from "../enums/member.enum";
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
}

