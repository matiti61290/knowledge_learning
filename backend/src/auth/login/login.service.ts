import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

/**
 * Class pour la connexion au compte utilisateur
 */
@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private jwtService: JwtService
    ){}

    /**
     * Methode pour connecter un utilisateur
     * @param loginUserDto 
     * @returns {token}
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