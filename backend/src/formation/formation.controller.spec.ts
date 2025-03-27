import { Test, TestingModule } from '@nestjs/testing';
import { FormationController } from './formation.controller';
import { FormationService } from './formation.service';
import { Repository } from 'typeorm';
import { Formation } from '../entities/formation.entity';
import { Category } from 'src/entities/category.entity';
import { Lesson } from 'src/entities/lesson.entity';

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
          findFormationByCategory: jest.fn(),
          findFormationById: jest.fn(),
          findLessonsByFormation: jest.fn(),
          findLessonById: jest.fn()
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
      jest.spyOn(formationService, 'findFormationByCategory').mockResolvedValueOnce(mockFormations as Formation[])
      const result = await formationController.findFormationByCategory(mockCategoryId)

      expect(formationService.findFormationByCategory).toHaveBeenCalledTimes(1)
      expect(formationService.findFormationByCategory).toHaveBeenCalledWith(mockCategoryId)
      expect(result).toEqual(mockFormations)
    })

    it('should return one formation based on an id', async () => {
      const mockFormationId = 1
      const mockFormation: Partial<Formation> = { id: 1, name: 'Initiation au piano'}

      jest.spyOn(formationService, 'findFormationById').mockResolvedValueOnce(mockFormation as Formation)

      const result = await formationController.findFormationById(mockFormationId)

      expect(formationService.findFormationById).toHaveBeenCalledTimes(1)
      expect(formationService.findFormationById).toHaveBeenCalledWith(mockFormationId)
      expect(result).toEqual(mockFormation)
    })

    it('Should return the list of lessons included in the chosen formation', async () => {
      const mockFormationId = 1
      const mockFormation: Partial<Formation> = {id: 1, name: 'Initiation au piano'}
      const mockLesson: Partial<Lesson>[] = [
        { id: 1, title: 'L\'instrument', formation: mockFormation[0]},
        {id: 2, title:'Les accords', formation: mockFormation}
      ]

      jest.spyOn(formationService, 'findLessonsByFormation').mockResolvedValueOnce(mockLesson as Lesson[])

      const result = await formationController.findLessonsByFormation(mockFormationId)

      expect(formationService.findLessonsByFormation).toHaveBeenCalledTimes(1)
      expect(formationService.findLessonsByFormation).toHaveBeenCalledWith(mockFormationId)
      expect(result).toEqual(mockLesson)
    })

    it('Should return a lesson based on a formation', async() => {
      const mockFormationId = 1
      const mockLessonId = 1
      const mockFormation: Partial<Formation> = {id: 1, name: 'Initiation au piano'}
      const mockLesson: Partial<Lesson> = { id: 1, title: 'L\'instrument', formation: mockFormation[0]}

      jest.spyOn(formationService, 'findLessonById').mockResolvedValueOnce(mockLesson as Lesson)

      const result = await formationController.findLessonById(mockFormationId, mockLessonId)

      expect(formationService.findLessonById).toHaveBeenCalledTimes(1)
      expect(formationService.findLessonById).toHaveBeenLastCalledWith(mockFormationId, mockLessonId)
      expect(result).toEqual(mockLesson)
    })
  })
});
