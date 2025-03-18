import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserController', () => {
  let userController: UserController;
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
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    
    userController = module.get<UserController>(UserController)
    userService = module.get<UserService>(UserService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  });

  describe('Find all users', () => {
    it('should return an array of users', async () => {
      const result: Partial<User>[] = [{id: 1, firstname:'John', lastname:'Doe', mail:'johndoe@test.com'}]
      jest.spyOn(userService, 'findAll').mockImplementation(() => Promise.resolve(result as User[]))

      expect(await userController.getAllUsers()).toBe(result)
    })
  })
});
