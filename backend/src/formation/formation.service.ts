import { Injectable } from '@nestjs/common';
import { Formation } from '../entities/formation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FormationService {
    constructor(
        @InjectRepository(Formation)
        private readonly formationRepository: Repository<Formation>
    ) {}

    async findAll(): Promise<Formation[]> {
        return this.formationRepository.find()
    }
}
