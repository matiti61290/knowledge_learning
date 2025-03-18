import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from 'src/entities/role.entity';
import { MailService } from 'src/mail/mail.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY
        })],
    controllers: [UserController],
    providers: [UserService, MailService],
    exports: [UserService, JwtModule]
})
export class UserModule {}
