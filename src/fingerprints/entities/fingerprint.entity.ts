import { Member } from "src/members/entities/member.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('fingerprints')
export class Fingerprint {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'text' })
    fingerTemplate: string

    @OneToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'memberId' })
    member: Member;

    @Column()
    memberId: string;
}
