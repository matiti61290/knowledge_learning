import { Test, TestingModule} from '@nestjs/testing'
import { ForgotPasswordService } from './forgot-password.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '../../entities/user.entity'
import { CheckMailDto } from '../../dto/check-mail.dto'
import { NewPasswordDto } from '../../dto/newPassword.dto'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ChangePasswordMailService } from '../../mail/changePasswordMail/change-password-mail/change-password-mail.service'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('ForgotPasswordService', () => {
    let forgotPasswordService: ForgotPasswordService
    let jwtService: JwtService
    let userRepository: Repository<User>
    let changePasswordMailService: ChangePasswordMailService

    //Mock repositories and services used in the ForgotPasswordService
    beforeEach(async () => {
        const mockUserRepository = {
            findOne: jest.fn(),
            save: jest.fn()
        }
        const mockChangePasswordMailService = {
            sendChangePasswordMail: jest.fn() 
        }

        //Create the testing module
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ForgotPasswordService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    }
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository
                },
                {
                    provide: ChangePasswordMailService,
                    useValue: mockChangePasswordMailService
                }
            ]
        }).compile()

        forgotPasswordService = module.get<ForgotPasswordService>(ForgotPasswordService)
        jwtService = module.get<JwtService>(JwtService)
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        changePasswordMailService = module.get<ChangePasswordMailService>(ChangePasswordMailService)
    })

    //Tests grouped by method in the ForgotPasswordService
    describe('sendMailPassword', () => {
        it('should return an error if user doesn\' exist', async () => {
            const checkMailDto = new CheckMailDto()
            Object.assign(checkMailDto, {
                mail: 'John.Doe@test.com'
            })
    
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null)
            await expect(forgotPasswordService.sendMailPassword(checkMailDto)).rejects.toThrow(NotFoundException)
        })
    
        it('should generate a token and send a mail', async () => {
            const checkMailDto = new CheckMailDto()
            Object.assign(checkMailDto, {
                mail: 'John.Doe@test.com'
            })
    
            const user: Partial<User> = {
                id: 1,
                mail: 'John.Doe@test.com'
            }
    
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user as User)
            jest.spyOn(jwtService, 'sign').mockReturnValueOnce('mocked-token')
            const mailSpy = jest.spyOn(changePasswordMailService, 'sendChangePasswordMail')
        
            await forgotPasswordService.sendMailPassword(checkMailDto)
        
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { mail: 'John.Doe@test.com' } })
            expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id })
            expect(mailSpy).toHaveBeenCalledWith(user.mail, 'mocked-token')
        })
    })
   
    describe('changePassword', () =>  {
        it('Should retrieve user info from the token and check if the user exists', async () => {
            const newPasswordDto = new NewPasswordDto()
            Object.assign(newPasswordDto, {
                newPassword: 'JohnDoe61@',
                confirmPassword: 'JohnDoe61@'
            })
            const mockToken = 'mocked-token'
    
            jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ id:99 })
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null)
    
            await expect(forgotPasswordService.changePassword(mockToken, newPasswordDto)).rejects.toThrow(NotFoundException);
            
        })
    
        it('Should check if the new password corresponds with the confirm password and throw an error if no', async() => {
            const mockToken = 'mocked-token'
            const newPasswordDto = new NewPasswordDto()
            Object.assign(newPasswordDto, {
                newPassword: 'JohnDoe61@',
                confirmPassword: 'DoeJohn61@'
            })
    
            const mockUser: Partial<User> = {
                id: 1,
                mail: 'johnDoe@test.com',
                password: 'CurrentPassword61@'
            }
            
    
            jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ id: 1})
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser as User)
    
            await expect(forgotPasswordService.changePassword(mockToken, newPasswordDto)).rejects.toThrow(new BadRequestException('Les mots de passe ne correspondent pas'))
    
        })
    
        it('Should hash the password and save it in database', async () => {
            const mockToken = 'mocked-token'
            const newPasswordDto = new NewPasswordDto()
            Object.assign(newPasswordDto, {
                newPassword: 'JohnDoe61@',
                confirmPassword: 'JohnDoe61@'
            })
    
            const mockUser: Partial<User> = {
                id: 1,
                mail: 'johnDoe@test.com',
                password: 'CurrentPassword61@'
            }
    
            const hashedPassword = 'hashed-password'
    
            jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ id: 1})
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser as User)
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword)
    
            const savePassword = jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser as User)
    
            await forgotPasswordService.changePassword(mockToken, newPasswordDto)
    
            expect(mockUser.password).toBe(hashedPassword)
    
            expect(savePassword).toHaveBeenCalledWith(mockUser)
        })
    })
  
})