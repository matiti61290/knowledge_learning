import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/ormconfig';
import { UserModule } from './user/user.module';
import { RegisterModule } from './auth/register/register.module';
import { RegisterController } from './auth/register/register.controller';
import { LoginModule } from './auth/login/login.module';
import { ForgotPasswordController } from './auth/forgot-password/forgot-password.controller';
import { ForgotPasswordModule } from './auth/forgot-password/forgot-password.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    RegisterModule,
    LoginModule,
    ForgotPasswordModule
  ],
  controllers: [AppController, UserController, RegisterController],
  providers: [AppService],
})
export class AppModule {}
