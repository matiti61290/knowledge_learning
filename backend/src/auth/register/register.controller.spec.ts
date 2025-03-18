import { Test, TestingModule } from '@nestjs/testing'
import { RegisterService } from './register.service'
import { RegisterController } from './register.controller'
import { CreateUserDto } from '../../dto/create-user.dto'
import { User } from '../../entities/user.entity';

describe('RegisterController', () => {
    let registerController: RegisterController
    let registerService: RegisterService

    // Setup the module for tests
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RegisterController],
            providers: [{
                provide: RegisterService,
                useValue: {
                    registration: jest.fn(),
                    validateUser: jest.fn()
                }
            }]
        }).compile()
        
        registerController = module.get<RegisterController>(RegisterController)
        registerService = module.get<RegisterService>(RegisterService)
    })

    describe('test the registration controller', () => {
        // Test the register route
        it('should call the service and return the result', async () => {
            const createUserDto = new CreateUserDto();
            Object.assign(createUserDto, {
                firstname: 'John',
                lastname: 'Doe',
                mail: 'johndoe@test.com',
                password: 'P@ssword123',
                confirmPassword: 'P@ssword123',
            });
            const mockResult: Partial<User> = {
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                mail: createUserDto.mail,
                password: 'hashedPassword',
                is_verified: false,
                roles: []
            };
            

            jest.spyOn(registerService, 'registration').mockResolvedValueOnce(mockResult as User);

            const result = await registerController.registrationUser(createUserDto);

            
            expect(registerService.registration).toHaveBeenCalledWith(createUserDto);
            expect(result).toEqual(mockResult);
        });
    });

    describe('test the verificate controller', () => {
        // test the validation route
        it('should validate the user', async() =>{
            const mockToken = "mocked-token";

            const response = await registerController.validateAccount(mockToken)

            expect(registerService.validateUser).toHaveBeenCalledWith(mockToken)
            expect(response).toEqual({ message: 'User validated'})
        })
    })
});
