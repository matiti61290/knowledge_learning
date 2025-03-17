import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    async getAllUsers(): Promise<User[]>{
        return this.userService.findAll()
    }

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true}))
    async registrationUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.registrationStudent(createUserDto)
    }
}
