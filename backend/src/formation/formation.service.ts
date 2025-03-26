import { BadRequestException, Injectable } from '@nestjs/common';
import { Formation } from '../entities/formation.entity';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Gère la partie logique des formations
 */
@Injectable()
export class FormationService {
    constructor(
        @InjectRepository(Formation)
        private readonly formationRepository: Repository<Formation>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
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
     * - **BadRequestException** - Retourne cette exception si la catégorie n'existe pas
     */
    async findByCategory(categoryId: number): Promise<Formation[]> {3
        const existingCategory = await this.categoryRepository.findOne({ where: {id: categoryId}})
        
        if(!existingCategory) {
            throw new BadRequestException('Cette categorie n\'existe pas')
        }

        return this.formationRepository.find({
            where: {category: { id: categoryId}},
            relations: ['category']
        })
    }
}
