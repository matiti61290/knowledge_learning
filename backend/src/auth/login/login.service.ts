import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
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

    async login(loginUserDto: LoginUserDto){
        const user = await this.userRepository.findOne({ where: {mail: loginUserDto.mail} })
        
        if(!user){
            throw new UnauthorizedException('Email ou mot de passe incorrect')
        }

        const isPasswordValide = await bcrypt.compare(loginUserDto.password, user.password)
        if(!isPasswordValide){
            throw new UnauthorizedException('Email ou mot de passe incorrect')
        }

        const payload = { sub: user.id, email: user.mail}
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
