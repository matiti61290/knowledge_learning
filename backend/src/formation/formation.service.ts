import { Injectable, NotFoundException } from '@nestjs/common';
import { Formation } from '../entities/formation.entity';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../entities/lesson.entity';

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
        private readonly lessonRepository: Repository<Lesson>
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

    async findFormationById(formationId: number): Promise<Formation> {
        const existingFormation = await this.formationRepository.findOne({ where: { id: formationId}})

        if(!existingFormation) {
            throw new NotFoundException('Cette formation n\'existe pas')
        }
        return existingFormation
    }

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
}
