import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ConfirmMailService } from '../../mail/confirmMail/confirmMail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

/**
 * Gère la partie logique de l'inscription et de la validation de l'email
 */
@Injectable()
export class RegisterService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        private jwtService: JwtService,
        private confirmMailService: ConfirmMailService
    ){}

    /**
     * Enregistre le nouveau utilisateur en base de donnée apres avoir vérifier les informations
     * @function registration
     * @param {CreateUserDto} createUserDto - standardise les informations envoyées par l'utilisateur avec un dto (Data Transfert Object)
     * @returns {Promise<User> newUser} - retourne le nouveau utilisateur enregistré en base de donnée
     * 
    * Exceptions :
    * - **BadRequestException** : Si les mots de passe ne correspondent pas.
    * - **ConflictException** : Si l'email est déjà enregistré.
    */

    async registration(createUserDto: CreateUserDto): Promise<User> {
        // Check if password and confirmPassword are the same
        if (createUserDto.password !== createUserDto.confirmPassword){
            throw new BadRequestException('Les mots de passe ne correspondent pas')
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({ where: {mail: createUserDto.mail} })

        if (existingUser){
            throw new ConflictException('Cet email est deja utilisé.')
        }

        const roles = await this.roleRepository.find({ where: { name: 'student'} })

        // Encrypting the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt)

        // Create the user
        const newUser = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            roles
        })

        await this.userRepository.save(newUser);

        // Send verification mail
        const token = this.jwtService.sign({ id: newUser.id })
        await this.confirmMailService.sendVerificationMail(newUser.mail, token)

        return newUser
    }

    /**
     * 
     * @param {token} token - récupère les informations de l'utilisateur grâce à celui-ci.
     * 
     * Exceptions :
     *  - **Error** : Si l'utilisateur est introuvable en base de donnée
     *  
     */
    async validateUser(token: string){
        const payload = this.jwtService.verify(token)
        const user = await this.userRepository.findOne({ where: { id: payload.id }, }
        )

        if(!user) throw new NotFoundException('Utilisateur introuvable')

        user.is_verified = true;
        await this.userRepository.save(user)
    }
}
