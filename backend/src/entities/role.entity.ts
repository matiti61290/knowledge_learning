import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role{
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ length: 255})
    name: string;

    @ManyToOne(()=> User, (user)=> user.created_roles)
    @JoinColumn( { name: 'created_by' })
    createdBy: User;

    @ManyToOne(()=> User, (user)=> user.updated_roles)
    @JoinColumn({ name: 'updated_by' })
    updatedBy: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}