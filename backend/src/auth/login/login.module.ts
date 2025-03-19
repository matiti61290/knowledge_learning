import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY
        }), UserModule],
    controllers: [LoginController],
    providers: [LoginService],
    exports: [LoginService, JwtModule]

})
export class LoginModule {}
