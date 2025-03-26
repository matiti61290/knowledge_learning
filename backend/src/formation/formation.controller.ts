import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Formation } from 'src/entities/formation.entity';
import { FormationService } from './formation.service';


@Controller('formation')
export class FormationController {
    constructor(
        private readonly formationService: FormationService
    ) {}

    // Route to get all formations
    @Get('')
    async getAllFormation(): Promise<Formation[]> {
        return this.formationService.findAll()
    }

    //Route to get formation by categories
    @Get('category/:categoryId')
    async findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<Formation[]> {
        return this.formationService.findByCategory(categoryId)
    }
}
