import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tests')
export class Test {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    text: string

    @Column({ default: true })
    isActive: boolean
}
