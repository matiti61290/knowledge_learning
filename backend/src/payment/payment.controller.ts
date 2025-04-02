import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Stripe } from 'stripe'

@Controller('payment')
export class PaymentController {
    constructor( private readonly paymentService: PaymentService) {}


    // @Post('create-checkout-session')
    // async createCheckoutSession(
    //     @Body() body: {type: string, id: number}
    // ): Promise<Stripe.Checkout.Session> {
    //     const {type, id} = body
    //     return this.paymentService.createCheckoutSession(type, id)
    // }

    @Post('create-checkout-session/:type/:id')
    async createCheckoutSession(
        @Param('type') type: string, @Param('id') id: number){
            if(type === 'formation'){
                return this.paymentService.createCheckoutSessionFormation(id)
            } else if (type === 'lesson'){
                return this.paymentService.createCheckoutSessionLesson(id)
            }
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
