import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Formation } from "./formation.entity";
import { Lesson } from "./lesson.entity";

@Entity()
export class Purchase {
 
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column()
    purchase_date: Date;

    @Column()
    completion_date: Date;

    @ManyToOne(()=> User, (user)=> user.purchases)
    user: User;

    @ManyToOne(()=> Formation, (formation)=> formation.purchases)
    formation: Formation;

    @ManyToOne(()=> Lesson, (lesson)=> lesson.purchases)
    lesson: Lesson;
}