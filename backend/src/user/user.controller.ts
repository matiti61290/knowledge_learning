import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/login/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';



@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('/')
    @UseGuards(RolesGuard)
    @Roles('student', 'admin')
    getUser(@CurrentUser() user: User) {
        return this.userService.getUserById(user.id)
    }

    @Get('/userList')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async getAllUsers(): Promise<User[]>{
        return this.userService.findAll()
    }
}
