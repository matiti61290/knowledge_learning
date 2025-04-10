import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Lesson } from "./lesson.entity";

@Entity()
export class UserProgress {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ default: false })
    is_completed: boolean;

    @ManyToOne(()=> User, (user)=> user.progresses)
    user: User;

    @ManyToOne(()=> Lesson, (lesson)=> lesson.progresses)
    lesson: Lesson;

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}