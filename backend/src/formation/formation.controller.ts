import { Controller, Get } from '@nestjs/common';
import { Formation } from 'src/entities/formation.entity';
import { FormationService } from './formation.service';


@Controller('formation')
export class FormationController {
    constructor(
        private readonly formationService: FormationService
    ) {}

    @Get('')
    async getAllFormation(): Promise<Formation[]> {
        return this.formationService.findAll()
    }
}
