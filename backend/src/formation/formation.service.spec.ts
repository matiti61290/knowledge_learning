import { Test, TestingModule } from '@nestjs/testing';
import { FormationService } from './formation.service';
import { Repository } from 'typeorm';
import { Formation } from '../entities/formation.entity';
import { Category } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('FormationService', () => {
  let formationService: FormationService;
  let formationRepository: Repository<Formation>
  let categoryRepository: Repository<Category>

  beforeEach(async () => {

    const mockFormationRepository = {
      find: jest.fn()
    }

    const mockCategoryRepository = {
      findOne: jest.fn()
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
        }
      ]
    }).compile()

    formationService = module.get<FormationService>(FormationService)
    formationRepository = module.get<Repository<Formation>>(getRepositoryToken(Formation))
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category))
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

      await expect(formationService.findByCategory(mockCategoryId)).rejects.toThrow(BadRequestException)
    })

    it('should return a list of formation in function of the category', async () => {
      const mockCategoryId = 1
      const mockCategory: Partial<Category> = { id: 1, name: "Musique"}
      console.log(mockCategoryId)
      console.log(mockCategory)

      const mockFormations: Partial<Formation>[] = [
        {id: 1, name: "Initiation au piano", category: mockCategory as Category},
        {id: 2, name: "Initiation a la guitare", category: mockCategory as Category}
      ]
      console.log(mockFormations)

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(mockCategory as Category)
      jest.spyOn(formationRepository, 'find').mockResolvedValueOnce(mockFormations as Formation[])

      const result = await formationService.findByCategory(mockCategoryId)
      console.log(result)

      expect(result).toEqual(mockFormations)
      expect(formationRepository.find).toHaveBeenCalledWith({ where: {category: {id: mockCategoryId}},
      relations: ['category']}
      )
    })
  })
});
