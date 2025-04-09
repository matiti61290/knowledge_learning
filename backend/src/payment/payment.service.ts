import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Stripe } from 'stripe'
import { Request, Response} from 'express'
import { Formation } from '../entities/formation.entity';
import { Lesson } from '../entities/lesson.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import * as dotenv from 'dotenv'

dotenv.config()
@Injectable()
export class PaymentService {
    private stripe: Stripe
    constructor(
        @InjectRepository(Formation)
        private readonly formationRepository: Repository<Formation>,

        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JwtService
    ){
        const secretKey = process.env.STRIPE_SECRET

        if(!secretKey) {
            throw new NotFoundException('Stripe secret key must be defined')
        }

        this.stripe = new Stripe(secretKey)
    }

    async createCheckoutSessionFormation(id: number, user: any, type: string): Promise<Stripe.Checkout.Session> {
        const selectedFormation = await this.formationRepository.findOne({ where: { id: id}})

        const currentUser = user

        if(!selectedFormation) {
            throw new NotFoundException('Cette formation n\'existe pas')
        }

        try{
            const session = await this.stripe.checkout.sessions.create({
                line_items:[
                    {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: selectedFormation.name
                            },
                            unit_amount:  selectedFormation.price * 100
                        },
                        quantity: 1
                    }
                ],
                mode: 'payment',
                success_url: 'http://localhost:3000/payment/payment-success',
                cancel_url: 'http://localhost:3000/payment/payment-cancel',
                metadata: {
                    itemId: selectedFormation.id,
                    userId: currentUser.id,
                    type: type
                }
            })

            return session
        } catch (error) {
            console.error('Error creating session', error)
            throw new InternalServerErrorException(' Failed to create checkout session')
        }
    }

    async createCheckoutSessionLesson(id: number, user:any, type: string): Promise<Stripe.Checkout.Session> {
        const selectedLesson = await this.lessonRepository.findOne({where: {id: id}})
        
        const currentUser = user

        if (!selectedLesson){
            throw new NotFoundException('Cette lecon n\'existe pas.')
        }

        try{
            const session = await this.stripe.checkout.sessions.create({
                line_items:[
                    {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: selectedLesson.title
                            },
                            unit_amount:  selectedLesson.price * 100
                        },
                        quantity: 1
                    }
                ],
                mode: 'payment',
                success_url: 'http://localhost:3000/payment/payment-success',
                cancel_url: 'http://localhost:3000/payment/payment-cancel',
                metadata: {
                    itemId: selectedLesson.id,
                    userId: currentUser.id,
                    type: type
                }
            })
            
            console.log(session.metadata)
            return session
        } catch (error) {
            console.error('Error creating session', error)
            throw new InternalServerErrorException(' Failed to create checkout session')
        }
    }

    // Webhook
   async construcEventWebhook(req, res, signature) {
    console.log('Le service est appele')
    console.log('signature :', signature)
    console.log('Buffer :', Buffer.isBuffer(req.body))
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    if(!endpointSecret) {
        throw new NotFoundException('Webhook key not found')
    }

    let event: Stripe.Event
        try{
            event = this.stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            )
        } catch (error) {
            console.error('Webhook signature verification failed', error.message)
            return res.status(400).send(`Webhook error: ${error.message}`)
        }

        if(event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session
                console.log('Paiement confirme pour session:', session.id)
                const metadata = session.metadata
                if(!metadata){
                    throw new InternalServerErrorException('Les metadatas n\'existent pas')
                }

                const userId = metadata.userId
                const type = metadata.type
                const itemId = metadata.itemId

                if(!userId || !type || !itemId){
                    throw new InternalServerErrorException('Il manque des metadatas')
                } else {
                    console.log('les metadata sont recuperees', metadata)
                }

                console.log('user id :', userId,', type :', type, ',  item id :', itemId)
                
        } else {
            console.log(`event non gere: ${event.type}`)
        }

        return res.send({received: true})
   }
}