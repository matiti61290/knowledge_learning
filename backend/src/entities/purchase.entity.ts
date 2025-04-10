import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Formation } from "./formation.entity";
import { Lesson } from "./lesson.entity";

@Entity()
export class Purchase {
 
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @CreateDateColumn()
    purchase_date: Date;

    @UpdateDateColumn()
    completion_date: Date;

    @ManyToOne(()=> User, (user)=> user.purchases)
    user: User;

    @ManyToOne(()=> Formation, (formation)=> formation.purchases)
    formation: Formation;

    @ManyToOne(()=> Lesson, (lesson)=> lesson.purchases)
    lesson: Lesson;
}