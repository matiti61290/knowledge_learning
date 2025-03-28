import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Stripe } from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config()
@Injectable()
export class PaymentService {
    private stripe: Stripe
    constructor(){
        const secretKey = process.env.STRIPE_SECRET

        if(!secretKey) {
            throw new NotFoundException('Stripe secret key must be defined')
        }

        this.stripe = new Stripe(secretKey)
    }

    async createCheckoutSession(
        amount: number, currency: string, productId: string, quantity: number
    ): Promise<Stripe.Checkout.Session> {
        try{
            const session = await this.stripe.checkout.sessions.create({
                line_items:[
                    {
                        price_data: {
                            currency: currency,
                            product_data: {
                                name: 'test product'
                            },
                            unit_amount: amount *100
                        },
                        quantity: quantity
                    }
                ],
                mode: 'payment',
                success_url: 'http://localhost:3000/payment/success',
                cancel_url: 'http://localhost:4242/cancel.html',
                metadata: {
                    productId: productId
                }
            })

            return session
        } catch (error) {
            console.error('Error creating session', error)
            throw new InternalServerErrorException(' Failed to create checkout session')
        }
    }

}
