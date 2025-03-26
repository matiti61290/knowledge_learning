import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordMailService } from '../../mail/changePasswordMail/change-password-mail/change-password-mail.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { CheckMailDto } from '../../dto/check-mail.dto';
import { NewPasswordDto } from '../../dto/newPassword.dto';
import * as brcrypt from 'bcrypt'

/**
 * Gère la partie logique de l'envoie du mail avec un lien pour modifier le mot de passe, et la modification du mot de passe en base de donnée.
 */
@Injectable()
export class ForgotPasswordService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private changePasswordMailService: ChangePasswordMailService
    ) {}

    /**
     * Vérifie si le mail entre par l'utilisateur existe, genère un token et envoie un mail avec un lien pour modifier le mot de passe
     * @function sendMailPassword
     * @param {CheckMailDto} checkMailDto - vérifie le mail selon les règles definies. 
     * 
     * Exception:
     * - **BadRequestException** : si l'utilisateur n'existe pas en base de donnée
     */
    async sendMailPassword(checkMailDto: CheckMailDto){
        const user = await this.userRepository.findOne({ where: {mail: checkMailDto.mail}})
        if (!user) {
            throw new NotFoundException("Cet utilisateur n'existe pas")
        }

        const token = this.jwtService.sign({id: user.id })
        await this.changePasswordMailService.sendChangePasswordMail(user.mail, token)
    }

    /**
     * Recupère le token pour recupérer les informations de l'utilisateur, vérifier le nouveau mot de passe, et l'enregistrer en base de donnée
     * @function changePassword
     * @param {token} token - contient les informations de l'utilisateur
     * @param {NewPasswordDto} newPasswordDto - formate le nouveau mot de passe 
     * 
     * Exceptions:
     * - **BadRequestException**: si l'utilisateur n'existe pas en base de donnée ou si les mots de passe ne correspondent pas
     */
    async changePassword(token: string, newPasswordDto: NewPasswordDto){
        const payload = this.jwtService.verify(token)
        const user = await this.userRepository.findOne({ where: { id: payload.id}})
        if (!user) {
            throw new NotFoundException("Cet utilisateur n'existe pas")
        }

        if(newPasswordDto.newPassword !== newPasswordDto.confirmPassword) {
            throw new BadRequestException('Les mots de passe ne correspondent pas')
        }

        const salt = await brcrypt.genSalt(10)
        const newHashedPassword = await brcrypt.hash(newPasswordDto.newPassword, salt)

        user.password = newHashedPassword
        await this.userRepository.save(user)
    }
}
