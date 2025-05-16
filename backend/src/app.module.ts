import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { ForgotPasswordModule } from './auth/forgot-password/forgot-password.module';
import { FormationController } from './formation/formation.controller';
import { FormationModule } from './formation/formation.module';
import { PaymentModule } from './payment/payment.module';
import { CsrfModule } from './csrf/csrf.module';
import { CsrfController } from './csrf/csrf.controller';
import { CsrfMiddleware } from './middlewares/csrf.middleware';



@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    RegisterModule,
    LoginModule,
    ForgotPasswordModule,
    FormationModule,
    PaymentModule,
    CsrfModule
  ],
  controllers: [AppController, UserController, RegisterController, FormationController, CsrfController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware)
    .exclude(
      {path : 'csrf/token', method: RequestMethod.GET},
      {path: 'formations/', method:RequestMethod.GET},
      {path: 'login', method: RequestMethod.POST},
      {path: 'register', method: RequestMethod.POST},
      {path: 'formations/category/:categoryId', method: RequestMethod.GET},
      {path: 'formations/:formationId', method: RequestMethod.GET},
      // {path: '/logged', method: RequestMethod.GET}
    ).forRoutes('*')
  }
}
