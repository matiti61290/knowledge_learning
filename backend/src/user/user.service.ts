import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { CreateUserDto } from 'src/dto/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ){}
    
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async registrationStudent(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password !== createUserDto.confirmPassword){
            throw new BadRequestException('les mots de passe ne correspondent pas')
        }
        
        const existingUser = await this.userRepository.findOne({where :{ mail: createUserDto.mail},
        })

        if (existingUser){
            throw new ConflictException('Cet email est deja utilise.')
        }

        const roles = await this.roleRepository.find({ where: {name: 'student'}})

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt)

        const newUser = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            roles
        })

        return this.userRepository.save(newUser);
    }

}
