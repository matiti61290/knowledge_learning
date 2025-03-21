import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoginModule } from '../auth/login/login.module';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv'
import { LoginService } from 'src/auth/login/login.service';


dotenv.config()
@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => LoginModule), JwtModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
