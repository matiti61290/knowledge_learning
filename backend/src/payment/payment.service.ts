import {ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Stripe } from 'stripe'
import { Formation } from '../entities/formation.entity';
import { Lesson } from '../entities/lesson.entity'
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Purchase } from '../entities/purchase.entity';
import { UserProgress } from '../entities/userProgress.entity';
import { UserCertification } from '../entities/userCertification.entity';
import * as dotenv from 'dotenv'

dotenv.config()
/**
 * Gère la partie logique du paiement
 */
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

        @InjectRepository(Purchase)
        private readonly purchaseRepository: Repository<Purchase>,

        @InjectRepository(UserProgress)
        private readonly userProgressRepository: Repository<UserProgress>,

        @InjectRepository(UserCertification)
        private readonly userCertification: Repository<UserCertification>
    ){
        const secretKey = process.env.STRIPE_SECRET

        if(!secretKey) {
            throw new NotFoundException('Stripe secret key must be defined')
        }

        this.stripe = new Stripe(secretKey)
    }

    /**
     * Créer la session de paiement Stripe
     * @param id - id de la formation voulue
     * @param user - contient des informations sur l'utilisateur actuellement connecté
     * @param type - Dans ce cas, le type est « formation ». Utilisé par le contrôleur pour appeler la méthode pour acheter une formation.
     * @returns une session de paiement Stripe
     */
    async createCheckoutSessionFormation(id: number, user: any, type: string): Promise<Stripe.Checkout.Session> {
        // Find the formation with the id
        const selectedFormation = await this.formationRepository.findOne({ where: { id: id}})

        //Get user informations
        const currentUser = user

        if(!selectedFormation) {
            throw new NotFoundException('Cette formation n\'existe pas')
        }

        // Create the Stripe checkout session. Return a internal server error if the creation fails
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
                success_url: 'https://knowledge-learning-1-7gl2.onrender.com',
                cancel_url: 'https://knowledge-learning-1-7gl2.onrender.com',
                metadata: {
                    itemId: selectedFormation.id,
                    userId: currentUser.id,
                    type: type,
                }
            })

            return session
        } catch (error) {
            throw new InternalServerErrorException('Failed to create checkout session')
        }
    }


    /**
     * Créer la session de paiement Stripe
     * @param id - id de la leçon voulue
     * @param user - contient des informations sur l'utilisateur actuellement connecté
     * @param type - Dans ce cas, le type est « leçon ». Utilisé par le contrôleur pour appeler la méthode pour acheter une leçon.
     * @returns une session de paiement Stripe
     */
    async createCheckoutSessionLesson(id: number, user:any, type: string): Promise<Stripe.Checkout.Session> {
        //Find the lesson with the id
        const selectedLesson = await this.lessonRepository.findOne({where: {id: id}})
        
        //Get user informations
        const currentUser = user

        if (!selectedLesson){
            throw new NotFoundException('Cette lecon n\'existe pas.')
        }

        //Create the Stripe checkout session. Return a internal server error if creation fails
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
                success_url: 'http://localhost:3001/payment/payment-success',
                cancel_url: 'http://localhost:3001/payment/payment-cancel',
                metadata: {
                    itemId: selectedLesson.id,
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
   async construcEventWebhook(req, res, signature) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    if(!endpointSecret) {
        throw new NotFoundException('Webhook key not found')
    }

   
    let event: Stripe.Event
         //Construct the Event for the webhook. Return a status 400 if no Stripe signature
        try{
            event = this.stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            )
        } catch (error) {
            return res.status(401).send(`Webhook error: ${error.message}`)
        }

        //Check the event type and get purchase informations from the metadata
        if(event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session
                const metadata = session.metadata
                if(!metadata){
                    throw new InternalServerErrorException('Les metadatas n\'existent pas')
                }

                const userId = Number(metadata.userId)
                const type = metadata.type
                const itemId = Number(metadata.itemId)

                if(!userId || !type || !itemId){
                    throw new InternalServerErrorException('Il manque des metadatas')
                }

                //Call the method to update the database with the purchase
                this.createPurchase(userId, type, itemId)
            
        }

        return res.send({received: true})
    }


   /**
    * Ajoute l'achat dans la table Purchase et la(les) leçon(s) dans la table User Progress
    * @param userId - Id de l'utilisateur réalisant l'achat
    * @param type - Permet de savoir s'il s'agit d'une formation ou d'une leçon
    * @param itemId - Id de la formation/leçon
    */
    async createPurchase(userId: number, type: string, itemId: number){
    // find user in the database
        const user = await this.userRepository.findOne({where: {id: userId}})

        if(!user){
            throw new NotFoundException('User not found')
        }

        let formation: Formation | null = null
        let lesson: Lesson | null = null

        // save the purchase and add lessons for the choosen formation if type = formation or if type = lesson
        if(type === 'formation'){
            formation = await this.formationRepository.findOne({where: {id: itemId}})

            //Get lessons of this formation
            const lessons: Lesson[] = await this.lessonRepository.find({where: {formation: {id: itemId}}, relations:['formation']})
            if(!formation){
                throw new NotFoundException('Formation not found')
            }
            if(!lessons){
                throw new NotFoundException('Lessons not found')
            }

            // check if formation isn't already purchased and if one of lessons in the formation isn't already purchased
            const existingPurchace = await this.purchaseRepository.findOne({ where: {user: {id: user.id}, formation: {id: formation.id}}})
            const existingLessonPurchase = await this.purchaseRepository.findOne({ where:{ user: {id:user.id}, lesson: {id: In(lessons.map(lesson => lesson.id))}}})

            if(existingPurchace){
                throw new ConflictException('Formation already bought')
            } else if(existingLessonPurchase) {
                throw new ConflictException('One of these lessons is already bought')
            } else {
                for(const lesson of lessons){
                    const newLesson = this.userProgressRepository.create({user, lesson, is_completed: false, formation})
                    await this.userProgressRepository.save(newLesson)
                }
        
                //Create a certificate in the userCertificate table
                const certificate = await this.userCertification.create({user, formation, is_completed: false})
                await this.userCertification.save(certificate)

                const purchase = await this. purchaseRepository.create({ user, formation })
                return this.purchaseRepository.save(purchase)
            }
        } else if (type === 'lesson') {
            lesson = await this.lessonRepository.findOne({ where: {id: itemId}, relations:['formation']})
            if(!lesson){
                throw new NotFoundException('Lesson not found')
            }

            const formation = lesson.formation
            
            const existingPurchace = await this.purchaseRepository.findOne({ where: {user: {id: user.id}, lesson: {id: lesson.id}}})

            if(existingPurchace){
                throw new ConflictException('Lesson already bought')
            } else {
                const newLesson = this.userProgressRepository.create({ user, lesson, is_completed: false, formation})
                await this.userProgressRepository.save(newLesson)

                const formationId = formation.id

                //Create a certificate in the userCertificate table and check if one with the same formation id already exists.
                // Avoid multiple lines for the same formation
                const existingFormationCertification = await this.userCertification.findOne({ where: {user: {id: user.id}, formation:{id: formationId}}})
                if(!existingFormationCertification){
                    const formationCertification = await this.userCertification.create({user, formation, is_completed: false})
                    await this.userCertification.save(formationCertification)
                }

                const purchase = await this.purchaseRepository.create({ user, lesson, formation})
                await this.purchaseRepository.save(purchase)
            }
        }
    }
}