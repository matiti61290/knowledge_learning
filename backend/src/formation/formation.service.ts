import { BadRequestException, Injectable } from '@nestjs/common';
import { Formation } from '../entities/formation.entity';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FormationService {
    constructor(
        @InjectRepository(Formation)
        private readonly formationRepository: Repository<Formation>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

    // Get all formation
    async findAll(): Promise<Formation[]> {
        return this.formationRepository.find()
    }

    //Get formation by category
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
