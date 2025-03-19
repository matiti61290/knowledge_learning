import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/ormconfig';
import { UserModule } from './user/user.module';
import { RegisterModule } from './auth/register/register.module';
import { RegisterController } from './auth/register/register.controller';
import { LoginModule } from './auth/login/login.module';
import { LoginService } from './auth/login/login.service';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    RegisterModule,
    LoginModule
  ],
  controllers: [AppController, UserController, RegisterController],
  providers: [AppService],
})
export class AppModule {}
