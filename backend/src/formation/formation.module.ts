import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formation } from 'src/entities/formation.entity';
import { FormationController } from './formation.controller';
import { FormationService } from './formation.service';
import { Category } from 'src/entities/category.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LoginModule } from 'src/auth/login/login.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { UserProgress } from 'src/entities/userProgress.entity';
import { UserCertification } from 'src/entities/userCertification.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Formation, Category, Lesson, User, UserProgress, UserCertification]), JwtModule, forwardRef(() => LoginModule)],
    controllers: [FormationController],
    providers: [FormationService],
    exports: [FormationService]
})
export class FormationModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).exclude('formations').forRoutes(FormationController)
    }
}
