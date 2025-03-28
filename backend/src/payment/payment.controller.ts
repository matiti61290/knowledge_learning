import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Stripe } from 'stripe'

@Controller('payment')
export class PaymentController {
    constructor( private readonly paymentService: PaymentService) {}

    @Get()
    async test(){
        return 'Hello Payment'
    }

    @Post('create-checkout-session')
    async createCheckoutSession(
        @Body() body: {amount: number, currency: string, productId: string, quantity: number}
    ): Promise<Stripe.Checkout.Session> {
        const {amount, currency, productId, quantity} = body
        return this.paymentService.createCheckoutSession(amount, currency, productId, quantity)
    }
}
