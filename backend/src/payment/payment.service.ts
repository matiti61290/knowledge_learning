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
                    lessonId: selectedFormation.id,
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
                    lessonId: selectedLesson.id,
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

    // Webhook
   
}