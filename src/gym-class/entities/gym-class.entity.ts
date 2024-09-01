import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('gym_classes')
export class GymClass {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    className: string;

    @Column({ length: 255 })
    professor: string;

    @Column()
    total: number;

    @Column()
    transferTotal: number;

    @Column()
    date: Date;

    @Column({ default: false })
    isCanceled: boolean;

    @Column()
    countAssistant: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
