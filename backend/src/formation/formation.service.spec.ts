import { Test, TestingModule } from '@nestjs/testing';
import { FormationService } from './formation.service';
import { Repository } from 'typeorm';
import { Formation } from '../entities/formation.entity';
import { Category } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Lesson } from '../entities/lesson.entity';

describe('FormationService', () => {
  let formationService: FormationService;
  let formationRepository: Repository<Formation>
  let categoryRepository: Repository<Category>
  let lessonRepository: Repository<Lesson>

  beforeEach(async () => {

    const mockFormationRepository = {
      find: jest.fn(),
      findOne: jest.fn()
    }

    const mockCategoryRepository = {
      findOne: jest.fn()
    }

    const mockLessonRepository ={
      findOne: jest.fn(),
      find: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormationService,
        {
          provide: getRepositoryToken(Formation),
          useValue: mockFormationRepository
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository
        },
        {
          provide: getRepositoryToken(Lesson),
          useValue: mockLessonRepository
        }
      ]
    }).compile()

    formationService = module.get<FormationService>(FormationService)
    formationRepository = module.get<Repository<Formation>>(getRepositoryToken(Formation))
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category))
    lessonRepository = module.get<Repository<Lesson>>(getRepositoryToken(Lesson))
  });

  describe('findAll method', ()=> {
    it('should return a list with all of formations', async ()=> {
      
      const mockFormation: Partial<Formation>[] = [
        {id: 1, name: 'initiation au piano'},
        {id: 2, name: 'initiation au developpement web'}
      ]

      jest.spyOn(formationRepository, 'find').mockResolvedValueOnce(mockFormation as Formation[])

      const result = await formationService.findAll()

      expect(result).toEqual(mockFormation)
      expect(formationRepository.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('find by category', ()=>{
    it('should find the requested category and check if it exists', async ()=> {
      const mockCategoryId = 1

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null)

      await expect(formationService.findFormationByCategory(mockCategoryId)).rejects.toThrow(NotFoundException)
    })

    it('should return a list of formation in function of the category', async () => {
      const mockCategoryId = 1
      const mockCategory: Partial<Category> = { id: 1, name: "Musique"}

      const mockFormations: Partial<Formation>[] = [
        {id: 1, name: "Initiation au piano", category: mockCategory as Category},
        {id: 2, name: "Initiation a la guitare", category: mockCategory as Category}
      ]

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(mockCategory as Category)
      jest.spyOn(formationRepository, 'find').mockResolvedValueOnce(mockFormations as Formation[])

      const result = await formationService.findFormationByCategory(mockCategoryId)

      expect(result).toEqual(mockFormations)
      expect(formationRepository.find).toHaveBeenCalledWith({ where: {category: {id: mockCategoryId}},
      relations: ['category']}
      )
    })
  })

  describe('find formation by id', ()=> {
    it('should throw an error if the doesn\'t exist', async () => {
      const mockFormationId = 1

      jest.spyOn(formationRepository, 'findOne').mockResolvedValueOnce(null)

      await expect(formationService.findFormationById(mockFormationId)).rejects.toThrow(NotFoundException)
    })

    it('should return a formation',async () => {
      const mockFormationId = 1
      const mockFormation: Partial<Formation> = {id: 1, name: 'Initiation au piano'}

      jest.spyOn(formationRepository, 'findOne').mockResolvedValueOnce(mockFormation as Formation)

      const result = await formationService.findFormationById(mockFormationId)

      expect(formationRepository.findOne).toHaveBeenCalledWith({ where: {id: mockFormationId}})
      expect(formationRepository.findOne).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockFormation)
    })
  })

  describe('Find lessons by formation', () => {
    it('Should throw an error if the formation doesn\'t exist', async () => {
      const mockFormationId = 1

      jest.spyOn(formationRepository, 'findOne').mockResolvedValueOnce(null)

      await expect(formationService.findLessonsByFormation(mockFormationId)).rejects.toThrow(NotFoundException)
    })

    it('Should return a list of lesson for a given formation', async() => {
      const mockFormationId = 1
      const mockFormation: Partial<Formation> = { id:1, name: "Initiation au piano"}
      const mockLesson: Partial<Lesson>[] = [
        {id: 1, title:"L'instrument'"},
        {id: 2, title:"les accords"}
      ]

      jest.spyOn(formationRepository, 'findOne').mockResolvedValueOnce(mockFormation as Formation)
      jest.spyOn(lessonRepository, 'find').mockResolvedValueOnce(mockLesson as Lesson[])

      const result = await formationService.findLessonsByFormation(mockFormationId)

      expect(formationRepository.findOne).toHaveBeenCalledWith({ where: {id: mockFormationId}})
      expect(formationRepository.findOne).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockLesson)
    })
  })

  describe('Find a lesson by Id', () => {
    it('Should return a Not Found Exception if the lesson doesn\'t exist', async () => {
      const mockFormationId = 1
      const mockLessonId = 1

      const mockFormation: Partial<Formation> = { id:1, name:'Initiation au piano'}

      jest.spyOn(formationRepository, 'findOne').mockResolvedValueOnce(mockFormation as Formation)
      jest.spyOn(lessonRepository, 'findOne').mockResolvedValueOnce(null)

      await expect(formationService.findLessonById(mockFormationId, mockLessonId)).rejects.toThrow(NotFoundException)
    })

    it('Should return a formation with its id', async () => {
      const mockFormationId = 1
      const mockLessonId = 1

      const mockFormation: Partial<Formation> = {id: 1, name:'Initiation au piano'}
      const mockLesson: Partial<Lesson> = {id:1, title:'L\'instrument'}

      jest.spyOn(formationRepository, 'findOne').mockResolvedValueOnce(mockFormation as Formation)
      jest.spyOn(lessonRepository, 'findOne').mockResolvedValueOnce(mockLesson as Lesson).mockResolvedValueOnce(mockLesson as Lesson)

      const result = await formationService.findLessonById(mockFormationId, mockLessonId)

      expect(formationRepository.findOne).toHaveBeenCalledWith({ where: {id: mockFormationId}})
      expect(formationRepository.findOne).toHaveBeenCalledTimes(1)

      expect(lessonRepository.findOne).toHaveBeenCalledWith({where: {id: mockLessonId}})
      expect(lessonRepository.findOne).toHaveBeenCalledTimes(2)
      expect(result).toEqual(mockLesson)
    })
  })
});
