import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

/**
 * Gère la partie logique de la connexion de l'utilisateur
 */
@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private jwtService: JwtService
    ){}

    /**
     * Méthode pour connecter un utilisateur
     * @param {LoginUserDto} loginUserDto - standardise les informations envoyées par l'utilisateur avec un dto (Data Transfert Object)
     * @returns {token} - permet de conserver les informations dans le payload et garder l'utilisateur connecté
     * 
     * Exceptions:
     * - **UnauthorizedException** : Si le(s) mail et/ou mot de passe ne correspond(ent) pas
     */
    async login(loginUserDto: LoginUserDto){
        const user = await this.userRepository.findOne({ where: {mail: loginUserDto.mail}, relations: ['roles'] })

        // Check if user exists
        if(!user){
            throw new UnauthorizedException('Email ou mot de passe incorrect')
        }

        // Check if passwords correspond
        const isPasswordValide = await bcrypt.compare(loginUserDto.password, user.password)
        if(!isPasswordValide){
            throw new UnauthorizedException('Email ou mot de passe incorrect')
        }

        // generate the token
        const roles = user.roles.map(role=> role.name)
        const payload = { id: user.id, email: user.mail, role: roles}
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}