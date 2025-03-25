import { Test, TestingModule } from '@nestjs/testing'
import { LoginService } from './login.service'
import { LoginController } from './login.controller'
import { LoginUserDto } from '../../dto/login-user.dto'

describe('LoginController', () => {
    let loginService : LoginService
    let loginController: LoginController

    beforeEach(async () => {
        //Create the testing module
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginController],
            providers:[{
                provide: LoginService,
                useValue: {
                    login: jest.fn()
                }
            }]
        }).compile()

        loginService = module.get<LoginService>(LoginService)
        loginController = module.get<LoginController>(LoginController)
    })

    //Test for each route in the LoginController
    describe('test the login controller', ()  => {
         it('sould call the login service and return a result', async () => {
            const loginUserDto = new LoginUserDto()
            Object.assign(loginUserDto, {
                mail: 'John.Doe@test.com',
                password: 'JohnDoe61@'
            })


            const mockToken = { access_token: 'mock-token'} 
            
            jest.spyOn(loginService, 'login').mockResolvedValueOnce(mockToken)

            const result = await loginController.login(loginUserDto)

            expect(loginService.login).toHaveBeenCalledWith(loginUserDto)
            expect(result).toEqual(mockToken)
         })
    })
})