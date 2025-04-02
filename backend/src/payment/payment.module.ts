import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formation } from 'src/entities/formation.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Lesson } from 'src/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Formation, Lesson])],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
