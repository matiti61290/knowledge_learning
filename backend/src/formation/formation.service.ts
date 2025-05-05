import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Formation } from '../entities/formation.entity';
import { Category } from '../entities/category.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../entities/lesson.entity';
import { User } from '../entities/user.entity'
import { UserProgress } from '../entities/userProgress.entity';
import { UserCertification } from '../entities/userCertification.entity';

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

    /**
     * Methode pour valider une lecon et verifier si toutes les lecons d'une formation ont ete completees
     * @param user - information de l'utilisateur qui a achete la formation
     * @param lessonId - Id de la lecon pour la retrouver en base de donnee
     */
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
            throw new InternalServerErrorException('You already completed this lesson')
        }

        lessonInProgress.is_completed = true
        await this.userProgressRepository.save(lessonInProgress)

        // check if certification can be delivered
            // Find lessons in progress for the formation
        const formationId = lessonInProgress.formation.id
        const lessonsInProgress: UserProgress[] = await this.userProgressRepository.find({where:{ formation:{id: formationId}}})

            // Find lessons of the formation
        const lessonsInFormation: Lesson[] = await this.lessonRepository.find({where:{formation:{id:formationId}}, relations:['formation']})

        const numberLessonsInFormation = lessonsInFormation.length

        const numberLessonsInProgressInFormation = lessonsInProgress.length

        //Check if user bought each lesson of a formation, and if each lesson is completed
        for (const lessonInProgress of lessonsInProgress){
            if(numberLessonsInFormation !== numberLessonsInProgressInFormation){
                throw new InternalServerErrorException('You didn\'t buy each lessons of the formation')
            }
            const isCompleted = lessonInProgress.is_completed
            if(isCompleted === false){
                throw new InternalServerErrorException('One of the lessons isn\'t completed')
            }
        }
        //call the method to validate the certification
        this.validateCertification(formationId, user)
    }

    /**
     * Méthode pour valider la certification si toutes les leçons ont été complétées
     * @param formationId - Identifiant de la formation pour la retrouver en base de données
     * @param user - Informations de l'utilisateur
     */
    async validateCertification(formationId: number, user: any){
        const formationCertification = await this.userCertification.findOne({where:{formation: {id:formationId}, user:{ id: user.id}}})
        
        if(!formationCertification){
            throw new NotFoundException("Il n'y a pas de certificat de validation pour cette formation")
        }

        formationCertification.is_completed = true
        await this.userCertification.save(formationCertification)
    }

    /**
     * Récupère les données de l'utilisateur et de la formation si la formation a été complétée.
     * @param formationId - Identifiant de la formation pour la retrouver en base de données
     * @param user - Informations de l'utilisateur
     * @returns - retourne les informations de la formation et de l'utilisateur
     */
    async certification(formationId: number, user: any){
        const formationCertified = await this.userCertification.findOne({where:{formation: {id:formationId}, user:{ id: user.id}}})

        if(!formationCertified){
            throw new NotFoundException('Cette formation n\'a pas ete completee')
        }

        if (formationCertified.is_completed === false){
            throw new InternalServerErrorException('La formation n\'est pas completee')
        }
        const currentUser = await this.userRepository.findOne({where: {id: user.id}})

        if(!currentUser){
            throw new NotFoundException('User not found')
        }

        const currentFormation = await this.formationRepository.findOne({where: {id: formationId}})

        if(!currentFormation){
            throw new NotFoundException("Formation not found")
        }

        //replace by data when front will be added
        return `Bravo ${currentUser.firstname}. Vous avez complete la formation ${currentFormation.name}.`
    }
}