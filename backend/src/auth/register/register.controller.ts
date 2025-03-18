import { Controller, Post, Body, ValidationPipe, UsePipes, Query, Get } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Controller('register')
export class RegisterController {

    constructor(
        private readonly registerService: RegisterService 
    ){}

    // Route for sign up
    @Post()
    @UsePipes( new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true}))
    async registrationUser(@Body() createUserDto: CreateUserDto) {
        return this.registerService.registration(createUserDto)
    }

    // Validation account
    @Get('validation')
    async validateAccount(@Query('token') token: string) {
        return this.registerService.validateUser(token)
    }
}