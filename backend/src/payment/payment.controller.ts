import { Controller, Post, Get, Param, UseGuards, Query, NotFoundException, HttpCode, HttpStatus, Req, Res, Headers } from '@nestjs/common';
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
    @User() user, @Param('type') type: string, @Param('id') id: number, @Query('token') token: string){
        if(type === 'formation'){
            return this.paymentService.createCheckoutSessionFormation(id, user, type)
        } else if (type === 'lesson'){
            return this.paymentService.createCheckoutSessionLesson(id, user, type)
        }
    }

    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handleStripeWebhook(
        @Req() request: Request,
        @Res() response: Response,
        @Headers('stripe-signature') signature: string
    ){
        console.log('le webhook est appele')
        console.log('signature :',signature)
        console.log('Buffer :', Buffer.isBuffer(request.body))
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

        if(!endpointSecret) {
            throw new NotFoundException('Webhook key not found')
        }

        let event: Stripe.Event
        try{
            event = this.stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            )
        } catch (error) {
            console.error('Webhook signature verification failed', error.message)
            return response.status(400).send(`Webhook error: ${error.message}`)
        }

        switch (event.type) {
            case 'checkout.session.completed' :
                const session = event.data.object as Stripe.Checkout.Session
                console.log('Paiement confirme pour session:', session.id)
                break
            
            default:
                console.log(`event non gere: ${event.type}`)
        }

        return response.send({received: true})
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