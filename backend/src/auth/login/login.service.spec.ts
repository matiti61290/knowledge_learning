import { Test, TestingModule } from '@nestjs/testing'
import { LoginService } from './login.service'
import { User } from '../../entities/user.entity'
import { LoginUserDto } from '../../dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { Repository  } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Role } from '../../entities/role.entity'

describe('LoginService', ()=> {
    let loginService : LoginService
    let jwtService: JwtService
    let userRepository: Repository<User>
    let roleRepository: Repository<Role>

    //Mock repositories used in the LoginService
    beforeEach(async ()=> {
        const mockUserRepository = {
            findOne: jest.fn()
        }

        const mockRoleRepository = {
            find: jest.fn()
        }

        //Create the testing module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mocked-jwt-token')
                    }
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository
                },
                {
                    provide: getRepositoryToken(Role),
                    useValue: mockRoleRepository
                }
            ]
        }).compile()

        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role))
        loginService = module.get<LoginService>(LoginService)
        jwtService = module.get<JwtService>(JwtService)
    })

    //Tests each step of the login
    it('Should return an error if user doesn\' exist', async () => {
        const loginUserDto = new LoginUserDto()
        Object.assign(loginUserDto, {
            mail: 'John.Doe@test.com',
            password: 'JohnDoe61@'
        })

        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
        await expect(loginService.login(loginUserDto)).rejects.toThrow('Email ou mot de passe incorrect')
    })

    it('should return an error if passwords don\'t match', async () => {
        const loginUserDto = new LoginUserDto()
        Object.assign(loginUserDto, {
            mail: 'John.Doe@test.com',
            password: 'Password123@'
        })

        const mockUser: Partial<User> = {
            mail: 'John.Doe@test.com',
            password: await bcrypt.hash('P@ssword123', 10)
        }

        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce( mockUser as User)
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)

        await expect(loginService.login(loginUserDto)).rejects.toThrow('Email ou mot de passe incorrect')
    })

    it('should generate a token after the login', async () => {
        const loginUserDto = new LoginUserDto()
        Object.assign(loginUserDto, {
            mail: 'John.Doe@test.com',
            password: 'Password123@'
        })

        const mockUser: Partial<User> = {
            id: 1,
            mail: 'John.Doe@test.com',
            password: await bcrypt.hash('Password123@', 10),
            roles: [{ name: "student"}] as Role[]
        }

        const expectedPayload = {
            id : mockUser.id,
            email: mockUser.mail,
            role: ['student']
        }

        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser as User)
        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)
        jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-jwt-token')

        const result = await loginService.login(loginUserDto)

        expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload)
        expect(result).toEqual({ access_token: 'mocked-jwt-token'})
    })
})