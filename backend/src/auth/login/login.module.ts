import { MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { Role } from 'src/entities/role.entity';
import * as dotenv from 'dotenv'
import { RolesGuard } from './guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

dotenv.config()
@Module({
    imports: [TypeOrmModule.forFeature([User, Role]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {expiresIn: '1h'}
        })],
    controllers: [LoginController],
    providers: [LoginService,{
        provide: APP_GUARD,
        useClass: RolesGuard
    }],
    exports: [LoginService, JwtModule]
})
export class LoginModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).exclude(
        {path: 'login', method: RequestMethod.POST},
        {path: 'logged', method: RequestMethod.GET},
        {path: 'logout', method: RequestMethod.POST})
        .forRoutes(LoginController)
    }
}
