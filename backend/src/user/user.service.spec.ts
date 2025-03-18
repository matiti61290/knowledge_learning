import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>

  beforeEach(async () => {
    const mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    }

    const module = await Test.createTestingModule({
      providers: [UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
      ],
    }).compile()

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  });

  describe('Find all users', ()=> {
    it('should return an array of users', async () => {
      const result: Partial<User>[] = [{id: 1, firstname:'John', lastname:'Doe', mail:'johndoe@test.com'}]
      jest.spyOn(userService, 'findAll').mockImplementation(() => Promise.resolve(result as User[]))

      expect(await userService.findAll()).toBe(result)
    })
  })



});
