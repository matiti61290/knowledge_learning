import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/login/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';



@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async getAllUsers(): Promise<User[]>{
        return this.userService.findAll()
    }
}
