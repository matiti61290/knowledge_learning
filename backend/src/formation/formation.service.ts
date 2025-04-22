import { Injectable, NotFoundException } from '@nestjs/common';
import { Formation } from '../entities/formation.entity';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../entities/lesson.entity';
import { User } from '../entities/user.entity'
import { UserProgress } from 'src/entities/userProgress.entity';
import { UserCertification } from 'src/entities/userCertification.entity';

/**
 * Gère la partie logique des formations
 */
@Injectable()
export class FormationService {
    constructor(
        @InjectRepository(Formation)
        private readonly formationRepository: Repository<Formation>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(UserProgress)
        private readonly userProgressRepository: Repository<UserProgress>,

        @InjectRepository(UserCertification)
        private readonly userCertification: Repository<UserCertification>
    ) {}

    /**
     * Méthode pour récupérer toutes les formations disponibles
     * @returns - Retourne la liste de toute les formations
     */
    async findAll(): Promise<Formation[]> {
        return this.formationRepository.find()
    }

    /**
     * Méthode pour récupérer toutes les formations selon la categorie choisie
     * @param categoryId - Id de la catégorie pour retourner les formations liées à celle-ci
     * @returns - Retourne une liste de formations pour la categorie choisie
     * 
     * Exception:
     * - **NotFoundException** - Retourne cette exception si la catégorie n'existe pas
     */
    async findFormationByCategory(categoryId: number): Promise<Formation[]> {
        const existingCategory = await this.categoryRepository.findOne({ where: {id: categoryId}})
        
        if(!existingCategory) {
            throw new NotFoundException('Cette categorie n\'existe pas')
        }

        return this.formationRepository.find({
            where: {category: { id: categoryId}},
            relations: ['category']
        })
    }

    /**
     * Méthode pour récupérer une formation à l'aide de son id
     * @param formationId - id de la formation souhaitée
     * @returns - Retourne la formation correspondant à l'id en paramètre
     */
    async findFormationById(formationId: number): Promise<Formation> {
        const existingFormation = await this.formationRepository.findOne({ where: { id: formationId}})

        if(!existingFormation) {
            throw new NotFoundException('Cette formation n\'existe pas')
        }
        return existingFormation
    }

    /**
     * Méthode pour récupérer les leçons d'une formation
     * @param formationId - id de la formation souhaitée
     * @returns - Retourne une liste contenant les leçons liées à la formation correspondant à l'id en paramètre
     */
    async findLessonsByFormation(formationId: number): Promise<Lesson[]> {
        const existingFormation = await this.formationRepository.findOne({ where: {id: formationId}})

        if(!existingFormation) {
            throw new NotFoundException('Cette formation n\'existe pas')
        }

        return this.lessonRepository.find({
            where: {formation: {id: formationId}},
            relations:['formation']
        })
    }

    /**
     * Méthode pour récupérer une lecon dans la formation sélectionnée
     * @param formationId - Id de la formation souhaitée
     * @param lessonId - Id de la leçon souhaitée
     * @returns - Retourne la leçoncorrespondant à l'id en paramètre si cette lecon fait partie de la formation en id
     */
    async findLessonById(formationId: number, lessonId: number): Promise<Lesson> {
        const existingFormation = await this.formationRepository.findOne({where: {id:formationId}})

        if(!existingFormation) {
            throw new NotFoundException('Cette formation n\'existe pas')
        }

        const existingLesson = await this.lessonRepository.findOne({where: {id: lessonId}})
        
        if(!existingLesson) {
            throw new NotFoundException('Cette lecon n\'existe pas')
        }

        const lesson = await this.lessonRepository.findOne({ where:{id: lessonId, formation: {id: formationId}},
        relations:['formation']})

        if(!lesson) {
            throw new NotFoundException('Cette lecon n\'existe pas pour cette formation')
        }

        return lesson
    }

    async validateLesson( user: any, lessonId: number) {

        const userId = user.id

        if(!userId){
            throw new NotFoundException('User not found')
        }

        const lessonInProgress = await this.userProgressRepository.findOne({where: {user: {id: userId}, lesson:{id: lessonId}}, relations:['formation']})

        if(!lessonInProgress) {
            throw new NotFoundException('Lesson in progress not found')
        }

        const lessonIsCompleted = lessonInProgress.is_completed

        if (lessonIsCompleted === true) {
            console.log('Vous avez deja completer cette lecon')
        }

        lessonInProgress.is_completed = true
        await this.userProgressRepository.save(lessonInProgress)

        // check if certificate can be delivered

        const formationInProgress = lessonInProgress.formation.id
        const lessonsInProgress: UserProgress[] = await this.userProgressRepository.find({where:{ formation:{id: formationInProgress}}})

        console.log(lessonsInProgress)

        for (const lessonInProgress of lessonsInProgress){
            const isCompleted = lessonInProgress.is_completed
            if(isCompleted === false){
                console.log('Une lecon n\'est pas completees')
                return
            }
        }
        console.log('Toutes les lecons sont completees')

        //call de la methode pour valider la formation
    }

    async validateCertification(formationId: number, user: any){
        const formationCertification = await this.userCertification.findOne({where:{id: formationId}})
    }
}