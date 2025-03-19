import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../../dto/create-user.dto';
import { MailService } from '../../mail/mail.service';
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
        private mailService: MailService
    ){}

    /**
     * Enregistre le nouveau utilisateur en base de donnée apres avoir vérifier les informations
     * @param createUserDto standardise les informations envoyées par l'utilisateur et les contraints
     * @returns {Promise<User> newUser} retourne le nouveau utilisateur enregistré en base de donnée
     */
    async registration(createUserDto: CreateUserDto): Promise<User> {
        // Check if password and confirmPassword are the same
        if (createUserDto.password !== createUserDto.confirmPassword){
            throw new BadRequestException('Les mots de passe ne correspondent pas')
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({ where: {mail: createUserDto.mail} })

        if (existingUser){
            throw new ConflictException('Cet email est deja utilise.')
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
        await this.mailService.sendVerificationMail(newUser.mail, token)

        return newUser
    }

    /**
     * Change le statut du compte en "verifié" après que l'utilisateur ait validé son compte
     * @param token envoyé via le service mail
     */
    async validateUser(token: string){
        const payload = this.jwtService.verify(token)
        const user = await this.userRepository.findOne({ where: { id: payload.id }})

        if(!user) throw new Error('Utilisateur introuvable')

        user.is_verified = true;
        await this.userRepository.save(user)
    }
}
