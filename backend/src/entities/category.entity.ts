import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Formation } from "./formation.entity";

@Entity()
export class Category{
    @PrimaryGeneratedColumn({ type: 'int'} )
    id: number;

    @Column({ length: 255 })
    name: string;

    @OneToMany(()=> Formation, (formation)=> formation.category)
    formations: Formation[];

    @ManyToOne(()=> User, (user)=> user.created_categories)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;

    @ManyToOne(()=> User, (user)=> user.updated_categories)
    @JoinColumn({ name: 'updated_by' })
    updatedBy: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}