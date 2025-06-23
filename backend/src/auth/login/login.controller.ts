import { Body, Controller, Get, Post, Req,  Res } from '@nestjs/common';
import { Request, Response } from 'express';
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
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true}) res: Response) {
            const { access_token } = await  this.loginService.login(loginUserDto)
            
            res.cookie('access_token', access_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1000*60*60*24
            })

        return {access_token}

    }

    //Check if user is logged and retrieve user data
    @Get('/logged')
    loggedUser(@Req() req: Request) {
        return req.user
    }
}