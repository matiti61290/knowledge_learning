import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Formation } from '../entities/formation.entity';
import { FormationService } from './formation.service';
import { Lesson } from '../entities/lesson.entity';
import { CurrentUser } from '../decorators/user.decorator';
import { RolesGuard } from '../auth/login/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

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
     * Voir formation.service pour la logique
     */
    @Get('')
    async getAllFormation(): Promise<Formation[]> {
        return this.formationService.findAll()
    }

    /**
     * Gère la route pour récupérer la certification d'une formation.
     * @param user - Informations de l'utilisateur
     * @param formationId - Identifiant de la formation
     * @returns 
     */
    @Get('/certification/:formationId')
    @UseGuards(RolesGuard)
    @Roles('student', 'admin')
    async certificate(
        @CurrentUser() user,
        @Param('formationId', ParseIntPipe) formationId: number
    ){
        return this.formationService.certification(formationId, user)
    }

    /**
     * Gère la route pour récupérer les formation pour une catégorie choisie
     * @param categoryId - Id de la catégorie choisie
     * @returns - Retourne une liste de formations de la catégorie choisie
     * Voir formation.service pour la logique
     */
    @Get('category/:categoryId')
    async findFormationByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<Formation[]> {
        return this.formationService.findFormationByCategory(categoryId)
    }

    /**
     * Gère la route pour récupérer la formation correspondant à l'id en paramètre
     * @param formationId - Id de la formation choisie
     * @returns - Retourne la formation correspondant à l'id en paramètre
     * Voir formation.service pour la logique
     */
    @Get('/:formationId')
    async findFormationById(@Param('formationId', ParseIntPipe) formationId: number): Promise<Formation> {
        return this.formationService.findFormationById(formationId)
    }

    /**
     * Gère la route pour récupérer toutes les leçons correspondant à la formation correspondant à l'id en paramètre
     * @param formationId -Id de la formation choisie
     * @returns - Retourne la liste des leçons liées à la formation
     * Voir formation.service pour la logique
     */
    @Get('/:formationId/lessons')
    async findLessonsByFormation(@Param('formationId', ParseIntPipe) formationId: number): Promise<Lesson[]> {
        return this.formationService.findLessonsByFormation(formationId)
    } 

    /**
     * Gère la route pour récupérer la leçon correspondant à l'id en paramètre parmi celles de la formation correspondant à l'id en paramètre
     * @param formationId - Id de la formation choisie
     * @param lessonId - Id de la leçon choisie
     * @returns - Retourne la leçon correspondant à l'id en paramètre si elle se trouve dans la formation choisie
     * Voir formation.service pour la logique
     */
    @Get('/:formationId/:lessonId')
    async findLessonById(
        @Param('formationId', ParseIntPipe) formationId: number,
        @Param('lessonId', ParseIntPipe) lessonId: number
    ): Promise<Lesson> {
        return this.formationService.findLessonById(formationId, lessonId)
    }

    /**
     * Gère la route pour valider une leçon.
     * @param user - Informations de l'utilisateur
     * @param lessonId - Identifiant de la leçon
     * @returns - Retourne une mise à jour de la base de données si la validation est acceptée.
     */
    @Post('/validate/:lessonId')
    @UseGuards(RolesGuard)
    @Roles('student', 'admin')
    async validateLesson(
        @CurrentUser() user,
        @Param('lessonId', ParseIntPipe) lessonId: number
    ) {
        return this.formationService.validateLesson(user, lessonId)
    }
}