import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";
import { Lesson } from "./lesson.entity";
import { Purchase } from "./purchase.entity";
import { UserCertification } from "./userCertification.entity";
import { UserProgress } from "./userProgress.entity";

@Entity()
export class Formation{
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'float'})
    price: number

    @ManyToOne(()=> Category, (category)=> category.formations)
    category: Category;

    @OneToMany(()=> Lesson, (lesson)=> lesson.formation)
    lessons: Lesson[]

    @OneToMany(()=> Purchase, (purchase)=> purchase.formation)
    purchases: Purchase[];

    @OneToMany(()=> UserProgress, (userProgress)=> userProgress.formation)
    progresses: UserProgress[]

    @OneToMany(()=> UserCertification, (userCertification)=> userCertification.formation)
    certificates: UserCertification[]

    @ManyToOne(()=> User, (user)=> user.created_formations)
    @JoinColumn({ name: 'created_by'})
    createdBy: User;

    @ManyToOne(()=> User, (user)=> user.updated_formations)
    @JoinColumn({ name: 'updated_by'})
    updatedBy: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date
}