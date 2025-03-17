import { Controller, Get, Post, Body } from '@nestjs/common';
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
    async registrationUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.registrationUser(createUserDto)
    }
}
