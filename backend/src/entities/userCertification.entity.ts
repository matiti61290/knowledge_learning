import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Formation } from "./formation.entity";

@Entity()
export class UserCertification {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ default: true })
    is_completed: boolean;

    @Column()
    certificate_url: string;

    @ManyToOne(()=> User, (user)=> user.certificates)
    user: User;

    @ManyToOne(()=> Formation, (formation)=> formation.certificates)
    formation: Formation;

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at
}