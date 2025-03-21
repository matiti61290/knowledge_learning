import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { CheckMailDto } from 'src/dto/check-mail.dto';
import { NewPasswordDto } from 'src/dto/newPassword.dto';

@Controller('forgot-password')
export class ForgotPasswordController {
    constructor(
        private readonly forgotPasswordService: ForgotPasswordService
    ){}

    @Post()
    async sendMailPassword (@Body() checkMailDto: CheckMailDto) {
        return this.forgotPasswordService.sendMailPassword(checkMailDto)
    }

    @Post('change-password')
    async changePassword(
        @Query('token') token: string,
        @Body() newPasswordDto: NewPasswordDto){
        return this.forgotPasswordService.changePassword(token, newPasswordDto)
    }
}
