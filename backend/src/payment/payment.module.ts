import { MiddlewareConsumer, Module, NestModule, forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formation } from 'src/entities/formation.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Lesson } from 'src/entities/lesson.entity';
import { JwtModule } from '@nestjs/jwt';
import { LoginModule } from 'src/auth/login/login.module';
import { User } from 'src/entities/user.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { Purchase } from 'src/entities/purchase.entity';
import { UserProgress } from 'src/entities/userProgress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Formation, Lesson, User, Purchase, UserProgress]), JwtModule, forwardRef(() => LoginModule)],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('payment/webhook', 'payment/payment-success').forRoutes(PaymentController)
  }
}