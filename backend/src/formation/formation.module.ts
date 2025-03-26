import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formation } from 'src/entities/formation.entity';
import { FormationController } from './formation.controller';
import { FormationService } from './formation.service';
import { Category } from 'src/entities/category.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Formation, Category])],
    controllers: [FormationController],
    providers: [FormationService],
    exports: [FormationService]
})
export class FormationModule {}
