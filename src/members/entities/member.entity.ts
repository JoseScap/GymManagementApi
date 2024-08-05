import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('members')
export class Member {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    fullName: string;

    @Column({ length: 15 })
    phoneNumber: string;

    @Column({
        type: 'enum',
        enum: ['Inactivo', 'Día', 'Semana', 'Mes'],
        default: 'Inactivo'
    })
    currentStatus: MemberStatus;

    @Column({ length: 20, unique: true })
    dni: string;

    @Column({ default: true })
    isActive: boolean;
}

export type MemberStatus = 'Inactivo' | 'Día' | 'Semana' | 'Mes';
