import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { RolesGuard } from 'src/auth/login/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';

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
    @UseGuards(RolesGuard)
    @Roles('student', 'admin')
    async createCheckoutSession(
        @User() user, @Param('type') type: string, @Param('id') id: number, @Query('token') token: string){
            if(type === 'formation'){
                return this.paymentService.createCheckoutSessionFormation(id, user)
            } else if (type === 'lesson'){
                return this.paymentService.createCheckoutSessionLesson(id, user)
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
