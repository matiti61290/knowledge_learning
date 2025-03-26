import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Formation } from 'src/entities/formation.entity';
import { FormationService } from './formation.service';

/**
 * Gère les routes pour les formations
 */
@Controller('formation')
export class FormationController {
    constructor(
        private readonly formationService: FormationService
    ) {}

    /**
     * Gère la route pour récupérer toutes les formations
     * @returns - Retourne une liste contenant toutes les formations
     */
    @Get('')
    async getAllFormation(): Promise<Formation[]> {
        return this.formationService.findAll()
    }

    /**
     * Gère la route pour récupérer les formation pour une catégorie choisie
     * @param categoryId - Id de la catégorie choisie
     * @returns - Retourne une liste de formations de la catégorie choisie
     */
    @Get('category/:categoryId')
    async findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<Formation[]> {
        return this.formationService.findByCategory(categoryId)
    }
}
