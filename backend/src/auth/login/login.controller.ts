import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUserDto } from '../../dto/login-user.dto';

/**
 * Gère les routes du login
 */

@Controller('login')
export class LoginController {
    constructor(
        private readonly loginService: LoginService
    ){}

    /**
     * Gère la route pour la connexion de l'utilisateur
     * @param {LoginUserDto} loginUserDto
     * Retourne un token jwt
     * voir login.service pour la logique
     */
    @Post()
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.loginService.login(loginUserDto)
    }
}