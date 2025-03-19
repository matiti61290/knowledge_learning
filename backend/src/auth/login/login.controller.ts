import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUserDto } from 'src/dto/login-user.dto';

@Controller('login')
export class LoginController {
    constructor(
        private readonly loginService: LoginService
    ){}

    @Post()
    async login(@Body() loginUserDto: LoginUserDto) {
        await this.loginService.login(loginUserDto)
        return {message: 'User connected'}
    }
}
