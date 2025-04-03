import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoginModule } from '../auth/login/login.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv'


dotenv.config()
@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => LoginModule), JwtModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
