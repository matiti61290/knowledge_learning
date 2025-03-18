import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { MailService } from 'src/mail/mail.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY
        }),
        UserModule],
        controllers: [RegisterController],
        providers: [RegisterService, MailService],
        exports: [RegisterService, JwtModule]
})
export class RegisterModule {}
