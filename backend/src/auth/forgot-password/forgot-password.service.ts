import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordMailService } from 'src/mail/changePasswordMail/change-password-mail/change-password-mail.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CheckMailDto } from 'src/dto/check-mail.dto';
import { NewPasswordDto } from 'src/dto/newPassword.dto';
import * as brcrypt from 'bcrypt'

@Injectable()
export class ForgotPasswordService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private changePasswordMailService: ChangePasswordMailService
    ) {}

    async sendMailPassword(checkMailDto: CheckMailDto){
        const user = await this.userRepository.findOne({ where: {mail: checkMailDto.mail}})
        console.log(user)
        if (!user) {
            throw new BadRequestException("Cet utilisateur n'existe pas")
        }

        const token = this.jwtService.sign({id: user.id })
        await this.changePasswordMailService.sendChangePasswordMail(user.mail, token)
    }


    async changePassword(token: string, newPasswordDto: NewPasswordDto){
        const payload = this.jwtService.verify(token)
        const user = await this.userRepository.findOne({ where: { id: payload.id}})
        if (!user) {
            throw new Error("Cet utilisateur n'existe pas")
        }

        if(newPasswordDto.newPassword !== newPasswordDto.confirmPassword) {
            throw new BadRequestException('Les mots de passe ne correspondent pas')
        }

        const salt = await brcrypt.genSalt(10)
        const newHashedPassword = await brcrypt.hash(newPasswordDto.newPassword, salt)

        user.password = newHashedPassword
        await this.userRepository.save(user)
        return "C'est bon"
    }
}
