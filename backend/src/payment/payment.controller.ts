import { Controller, Post, Get, Param, UseGuards, Query, NotFoundException, HttpCode, HttpStatus, Req, Res, Headers, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { RolesGuard } from '../auth/login/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { Stripe } from 'stripe'
import * as dotenv from 'dotenv'
import { Request, Response } from 'express';

dotenv.config()
/**
 * Gère les routes pour le paiement
 */
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

    /**
     * Route pour créer la session de paiement
     * @param user - contient les informations de l'utilisateur
     * @param type - Permet de définir si une formation ou une leçon est achetée
     * @param id - Contient l'id de la formation ou leçon
     * @returns une session de paiement Stripe
     */
    @Post('create-checkout-session/:type/:id')
    @UseGuards(RolesGuard)
    @Roles('student', 'admin')
    async createCheckoutSession(
    @CurrentUser() user, @Param('type') type: string, @Param('id') id: number){
        let session: Stripe.Checkout.Session

        if(type === 'formation'){
            session = await this.paymentService.createCheckoutSessionFormation(id, user, type)
            console.log('Session:', session)
        } else if (type === 'lesson'){
            session = await this.paymentService.createCheckoutSessionLesson(id, user, type)
        } else {
            throw new BadRequestException('Type invalide');
        }

          if (!session.url) {
            throw new InternalServerErrorException('Session créée mais URL absente');
        }

        const urlSession = session.url
        return urlSession
    }

    /**
     * Route gérant l'envoie de requête pour le webhook Stripe confirmant le paiement et mettant à jour la base de données.
     * @param req - Requête stripe envoyée au webhook
     * @param res - Réponse stripe reçue du webhook
     * @param signature - Générée au moment de valider l'achat. Contient les informations de la session de paiement tel que les metadatas
     * @returns une mise à jour de la base de données si l'achat est bien confirmé.
     */
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