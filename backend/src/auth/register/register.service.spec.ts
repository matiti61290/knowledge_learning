import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { MailService } from '../../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterService } from './register.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('RegisterService', () => {
    let registerService: RegisterService;
    let mailService: MailService;
    let jwtService: JwtService;
    let userRepository: Repository<User>;
    let roleRepository: Repository<Role>;

    beforeEach(async () => {
        const mockUserRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const mockRoleRepository = {
            find: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(Role),
                    useValue: mockRoleRepository,
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mocked-jwt-token'),
                    },
                },
                {
                    provide: MailService,
                    useValue: {
                        sendVerificationMail: jest.fn(),
                    },
                },
            ],
        }).compile();

        registerService = module.get<RegisterService>(RegisterService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
        jwtService = module.get<JwtService>(JwtService);
        mailService = module.get<MailService>(MailService);
    });

    describe('User Registration', () => {
        it('should throw an error if passwords do not match', async () => {
            const createUserDto = new CreateUserDto();
            Object.assign(createUserDto, {
                firstname: 'John',
                lastname: 'Doe',
                mail: 'johndoe@test.com',
                password: 'P@ssword123',
                confirmPassword: 'wrongP@ssword123',
            });

            await expect(registerService.registration(createUserDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw an error if mail already exists', async () => {
            const createUserDto = new CreateUserDto();
            Object.assign(createUserDto, {
                firstname: 'John',
                lastname: 'Doe',
                mail: 'johndoe@test.com',
                password: 'P@ssword123',
                confirmPassword: 'P@ssword123',
            });

            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({ id: 1 } as User);

            await expect(registerService.registration(createUserDto)).rejects.toThrow(ConflictException);
        });

        it('should register a new user successfully', async () => {
            const createUserDto = new CreateUserDto();
            Object.assign(createUserDto, {
                firstname: 'John',
                lastname: 'Doe',
                mail: 'johndoe@test.com',
                password: 'P@ssword123',
                confirmPassword: 'P@ssword123',
            });

            const mockUser: Partial<User> = {
                id: 1,
                firstname: createUserDto.firstname,
                lastname: createUserDto.lastname,
                mail: createUserDto.mail,
                password: 'hashedPassword',
                roles: [],
                is_verified: false,
                created_at: new Date(),
                updated_at: new Date(),
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(roleRepository, 'find').mockResolvedValueOnce([{ name: 'student' }] as Role[]);
            jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('mockSalt');
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
            jest.spyOn(userRepository, 'create').mockReturnValueOnce(mockUser as User);
            jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser as User);
            jest.spyOn(jwtService, 'sign').mockReturnValueOnce('mocked-jwt-token');

            const result = await registerService.registration(createUserDto);

            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { mail: createUserDto.mail } });
            expect(roleRepository.find).toHaveBeenCalledWith({ where: { name: 'student' } });
            expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 'mockSalt');
            expect(userRepository.create).toHaveBeenCalled();
            expect(userRepository.save).toHaveBeenCalled();
            expect(jwtService.sign).toHaveBeenCalledWith({ id: 1 });
            expect(mailService.sendVerificationMail).toHaveBeenCalledWith(createUserDto.mail, 'mocked-jwt-token');
            expect(result).toEqual(expect.objectContaining({ id: 1, mail: createUserDto.mail }));
        });
    });
});
