import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Stripe } from 'stripe'

@Controller('payment')
export class PaymentController {
    constructor( private readonly paymentService: PaymentService) {}


    @Post('create-checkout-session')
    async createCheckoutSession(
        @Body() body: {amount: number, currency: string, productId: string, quantity: number}
    ): Promise<Stripe.Checkout.Session> {
        const {amount, currency, productId, quantity} = body
        return this.paymentService.createCheckoutSession(amount, currency, productId, quantity)
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
