import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Formation } from 'src/entities/formation.entity';
import { FormationService } from './formation.service';
import { Lesson } from 'src/entities/lesson.entity';

/**
 * Gère les routes pour les formations
 */
@Controller('formations')
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
    async findFormationByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<Formation[]> {
        return this.formationService.findFormationByCategory(categoryId)
    }

    @Get('/:formationId')
    async findFormationById(@Param('formationId', ParseIntPipe) formationId: number): Promise<Formation> {
        return this.formationService.findFormationById(formationId)
    }

    @Get('/:formationId/lessons')
    async findLessonsByFormation(@Param('formationId', ParseIntPipe) formationId: number): Promise<Lesson[]> {
        return this.formationService.findLessonsByFormation(formationId)
    } 

    @Get('/:formationId/:lessonId')
    async findLessonById(
        @Param('formationId', ParseIntPipe) formationId: number,
        @Param('lessonId', ParseIntPipe) lessonId: number
    ): Promise<Lesson> {
        return this.formationService.findLessonById(formationId, lessonId)
    }
}
