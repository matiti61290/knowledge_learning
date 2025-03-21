import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';
import { ChangePasswordMailService } from 'src/mail/changePasswordMail/change-password-mail/change-password-mail.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]),
    JwtModule.register({
        secret: process.env.JWT_SECRET_KEY
    })],
    controllers: [ForgotPasswordController],
    providers: [ForgotPasswordService, ChangePasswordMailService],
    exports: [ForgotPasswordService, JwtModule]
})

export class ForgotPasswordModule {}
