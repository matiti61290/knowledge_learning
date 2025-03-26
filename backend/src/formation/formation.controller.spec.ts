import { Test, TestingModule } from '@nestjs/testing';
import { FormationController } from './formation.controller';
import { FormationService } from './formation.service';
import { Repository } from 'typeorm';
import { Formation } from '../entities/formation.entity';
import { Category } from 'src/entities/category.entity';

describe('FormationController', () => {
  let formationController: FormationController;
  let formationService : FormationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormationController],
      providers: [{
        provide: FormationService,
        useValue: {
          findAll: jest.fn(),
          findByCategory: jest.fn()
        }
      }]
    }).compile()

    formationController = module.get<FormationController>(FormationController)
    formationService = module.get<FormationService>(FormationService)
  });

  describe('Tests the formation controller', () => {
    it('should return all formations', async () => {
      const mockFormations: Partial<Formation>[] = [
        {id: 1, name: "initiation au piano"},
        {id: 2, name: "initiation au developpement web"}
      ]

      jest.spyOn(formationService, 'findAll').mockResolvedValueOnce(mockFormations as Formation[])

      const result = await formationController.getAllFormation()

      expect(formationService.findAll).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockFormations)
    })

    it('should return a list of formation for a given category', async ()=> {
      const mockCategory: Partial<Category>[] = [
        {id: 1, name: "Musique"},
        {id: 2, name: "Informatique"}
      ]

      const mockFormations: Partial<Formation>[] = [
        {id: 1, name: "initiation au piano", category: mockCategory[0] as Category},
        {id: 2, name: "initiation a la guitare", category: mockCategory[0] as Category}
      ]

      const mockCategoryId = 1 
      jest.spyOn(formationService, 'findByCategory').mockResolvedValueOnce(mockFormations as Formation[])
      const result = await formationController.findByCategory(mockCategoryId)
      console.log(result)

      expect(formationService.findByCategory).toHaveBeenCalledTimes(1)
      expect(formationService.findByCategory).toHaveBeenCalledWith(mockCategoryId)
      expect(result).toEqual(mockFormations)
    })
  })

});
