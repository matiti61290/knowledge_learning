import { Controller, Post, Get, Param, UseGuards, Query, NotFoundException, HttpCode, HttpStatus, Req, Res, Headers, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { RolesGuard } from 'src/auth/login/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { Stripe } from 'stripe'
import * as dotenv from 'dotenv'
import { Request, Response } from 'express';

dotenv.config()
@Controller('payment')
export class PaymentController {
    private stripe: Stripe
    constructor( private readonly paymentService: PaymentService) {
        const secretKey = process.env.STRIPE_SECRET

        if(!secretKey) {
            throw new NotFoundException('La secret key n\'est pas defini')
        }

        this.stripe = new Stripe(secretKey)
    }


    @Post('create-checkout-session/:type/:id')
    @UseGuards(RolesGuard)
    @Roles('student', 'admin')
    async createCheckoutSession(
    @User() user, @Param('type') type: string, @Param('id') id: number){
        if(type === 'formation'){
            return this.paymentService.createCheckoutSessionFormation(id, user, type)
        } else if (type === 'lesson'){
            return this.paymentService.createCheckoutSessionLesson(id, user, type)
        }
    }

    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handleStripeWebhook(
        @Req() req: Request,
        @Res() res: Response,
        @Headers('stripe-signature') signature: string
    ){
        return this.paymentService.construcEventWebhook(req, res, signature)
    }

    @Get('payment-success')
    async paymentSuccess(){
        return 'Paiement reussi!!'
    }

    @Get('payment-cancel')
    async paymentCancel() {
        return 'Paiement annule'
    }
}