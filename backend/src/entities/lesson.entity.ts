import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Formation } from "./formation.entity";
import { Purchase } from "./purchase.entity";
import { UserProgress } from "./userProgress.entity";

@Entity()
export class Lesson{
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'float'})
    price: number;

    @Column({ type: 'int' })
    index_order: number;

    @Column({ length: 255 })
    url_video: string;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(()=> Formation, (formation)=> formation.lessons)
    formation: Formation;

    @OneToMany(()=> Purchase, (purchase)=> purchase.lesson)
    purchases: Purchase[]

    @OneToMany(()=> UserProgress, (userProgress)=> userProgress.lesson)
    progresses: UserProgress[];

    @ManyToOne(()=> User, (user)=> user.created_lessons)
    @JoinColumn({ name: "created_by" })
    createdBy: User;

    @ManyToOne(()=> User, (user)=> user.updated_lessons)
    @JoinColumn({ name: 'updated_by' })
    updatedBy: User;
}