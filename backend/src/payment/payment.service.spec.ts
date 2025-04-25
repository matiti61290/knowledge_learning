import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import Stripe from 'stripe'
import { getRepositoryToken } from '@nestjs/typeorm';
import { Formation } from '../entities/formation.entity';
import { Purchase } from '../entities/purchase.entity';
import { UserProgress } from '../entities/userProgress.entity';
import { UserCertification } from '../entities/userCertification.entity';
import { Lesson } from '../entities/lesson.entity'
import { User } from '../entities/user.entity'
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { RolesGuard } from '../auth/login/guards/roles.guard' 
import { ExecutionContext } from '@nestjs/common';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let formationRepository: Repository<Formation>
  let purchaseRepository: Repository<Purchase>
  let userProgressRepository: Repository<UserProgress>
  let userCertificationRepository: Repository<UserCertification>
  let lessonRepository: Repository<Lesson>
  let userRepository: Repository<User>

  const mockFormationRepository = {
    findOne: jest.fn()
  }

  const mockPurchaseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn()
  }

  const mockUserProgressRepository = {
    create: jest.fn(),
    save: jest.fn()
  }

  const mockUserCertificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn()
  }

  const mockLessonRepository = {
    findOne: jest.fn(),
    find: jest.fn()
  }

  const mockUserRepository = {
    findOne: jest.fn()
  }

  const mockStripe = {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValueOnce({id: 'sess_123'})
      },
    },
    webhook: {
      constructEvent: jest.fn()
    }
  }

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {provide: getRepositoryToken(Formation), useValue: mockFormationRepository},
        {provide: getRepositoryToken(Lesson), useValue: mockLessonRepository},
        {provide: getRepositoryToken(User), useValue: mockUserRepository},
        {provide: getRepositoryToken(Purchase), useValue: mockPurchaseRepository},
        {provide: getRepositoryToken(UserProgress), useValue: mockUserProgressRepository},
        {provide: getRepositoryToken(UserCertification), useValue: mockUserCertificationRepository},
        {provide: Stripe, useValue:mockStripe}
      ]
    }).compile()

    paymentService = module.get<PaymentService>(PaymentService)
    formationRepository = module.get<Repository<Formation>>(getRepositoryToken(Formation))
    lessonRepository = module.get<Repository<Lesson>>(getRepositoryToken(Lesson))
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    purchaseRepository = module.get<Repository<Purchase>>(getRepositoryToken(Purchase))
    userProgressRepository = module.get<Repository<UserProgress>>(getRepositoryToken(UserProgress))
    userCertificationRepository = module.get<Repository<UserCertification>>(getRepositoryToken(UserCertification))
  })

  describe('create-checkout-session-formation', () => {
    it('should throw NotFoundExcetption if formation not found', async () => {
      jest.spyOn(formationRepository, 'findOne').mockResolvedValue(null)

      await expect(paymentService.createCheckoutSessionFormation(1, {id:2},'formation' )).rejects.toThrow(NotFoundException)
    })

    it('should create and return a Stripe checkout session', async() => {
      const mockFormation: Partial<Formation> = {id:1, name: 'formationTest', price: 10}

      jest.spyOn(formationRepository, 'findOne').mockResolvedValue(mockFormation as Formation)
      mockStripe.checkout.sessions.create.mockResolvedValueOnce({id: 'sess_123'})

      const session = await paymentService.createCheckoutSessionFormation(1, {id:2}, 'formation')
      console.log(session)
      expect(session).toHaveProperty('id')
      expect(session.id).toBeDefined()
    })
  })
});
