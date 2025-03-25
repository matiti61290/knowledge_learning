import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { CheckMailDto } from '../../dto/check-mail.dto';
import { NewPasswordDto } from '../../dto/newPassword.dto';

/**
 * Gère les routes liées au mot de passe oublié
 */
@Controller('forgot-password')
export class ForgotPasswordController {
    constructor(
        private readonly forgotPasswordService: ForgotPasswordService
    ){}

    /**
     * Gère la route pour l'envoie du mail contenant le lien pour modifier le mot de passe
     * @param checkMailDto
     * Voir forgot-password.service pour la logique
     */
    @Post()
    async sendMailPassword (@Body() checkMailDto: CheckMailDto) {
        return this.forgotPasswordService.sendMailPassword(checkMailDto)
    }

    /**
     * Gère la route pour modifier le mot de passe
     * @param token 
     * @param newPasswordDto 
     * Voir forgot-password.service pour la logique
     */
    @Post('change-password')
    async changePassword(
        @Query('token') token: string,
        @Body() newPasswordDto: NewPasswordDto){
        return this.forgotPasswordService.changePassword(token, newPasswordDto)
    }
}
