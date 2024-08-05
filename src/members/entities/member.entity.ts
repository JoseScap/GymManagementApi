import { Entity } from "typeorm";

@Entity('members')
export class Member {
    id: string
    fullName: string
    phoneNumber: string
    currentStatus: MemberStatus
    dni: string
}

export type MemberStatus = 'Inactivo' | 'Día' | 'Semana' | 'Mes'