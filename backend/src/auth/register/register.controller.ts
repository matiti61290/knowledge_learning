import { Controller, Post, Body, ValidationPipe, UsePipes, Query, Get } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateUserDto } from '../../dto/create-user.dto';

/**
 * Gère les routes de l'inscription
 */
@Controller('register')
export class RegisterController {

    constructor(
        private readonly registerService: RegisterService 
    ){}

    /**
     * Gère la route pour l'inscription.
     * @param {CreateUserDto} createUserDto 
     * @returns {Promise<User>}
     * Voir register.service.ts pour la logique.
     */
    @Post()
    @UsePipes( new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true}))
    async registrationUser(@Body() createUserDto: CreateUserDto) {
        return this.registerService.registration(createUserDto)
    }

    /**
     * Gère la route pour vérifier le compte
     * @param token 
     * Voir register.service.ts pour la logique.
     */
    @Get('validation')
    async validateAccount(@Query('token') token: string) {
        await this.registerService.validateUser(token)
        return { message: 'User validated' }
    }
}