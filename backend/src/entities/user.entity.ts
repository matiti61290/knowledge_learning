import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Role } from "./role.entity";
import { Category } from "./category.entity";
import { Formation } from "./formation.entity";
import { Lesson } from "./lesson.entity";
import { Purchase } from "./purchase.entity";
import { UserProgress } from "./userProgress.entity";
import { UserCertification } from "./userCertification.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ length: 255 })
    firstname: string;

    @Column({ length: 255 })
    lastname: string;
    
    @Column({ length: 255 })
    mail: string; 

    @Column({ length: 255 })
    password: string;

    @Column({ default: false })
    is_verified: boolean;

    // Relations between users
    @ManyToOne(()=> User, (user)=> user.created_users)
    created_by: User;

    @ManyToOne(()=> User, (user)=> user.updated_users)
    updated_by: User;

    @OneToMany(()=> User, (user)=> user.created_by)
    created_users: User[]

    @OneToMany(()=> User, (user)=> user.updated_by)
    updated_users: User[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date

    @OneToMany(()=> Purchase, (purchase)=> purchase.user)
    purchases: Purchase[];

    @OneToMany(()=> UserProgress, (userProgress)=> userProgress.user)
    progresses: UserProgress[];

    @OneToMany(()=> UserCertification, (userCertification)=> userCertification.user)
    certificates: UserCertification[];

    // Relation with other tables created_by and updated_by
    @OneToMany(()=> Role, (role)=>role.createdBy)
    created_roles: Role[]

    @OneToMany(()=> Role, (role)=> role.updatedBy)
    updated_roles: Role[]

    @OneToMany(()=> Category, (category)=> category.createdBy)
    created_categories: Category[];

    @OneToMany(()=> Category, (category)=> category.updatedBy)
    updated_categories: Category[];

    @OneToMany(()=> Formation, (formation)=> formation.createdBy)
    created_formations: Formation[];

    @OneToMany(()=> Formation, (formation)=> formation.updatedBy)
    updated_formations: Formation[];

    @OneToMany(()=> Lesson, (lesson)=> lesson.createdBy)
    created_lessons: Lesson[];

    @OneToMany(()=> Lesson, (lesson)=> lesson.updatedBy)
    updated_lessons: Lesson[];
}