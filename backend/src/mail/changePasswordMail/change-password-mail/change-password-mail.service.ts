import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

/**
 * Gère l'envoie du mail d'oubli du mot de passe
 */
@Injectable()
export class ChangePasswordMailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.PASSWORD_MAIL
        }
    });

    /**
     * Envoie le mail contenant le lien avec le token pour modifier le mot de passe
     * @param mail - adresse mail de l'utilisateur 
     * @param token - contient les informations de l'utilisateur
     */
    async sendChangePasswordMail(mail: string, token: string) {
        const link = `http://localhost:3000/forgot-password/change-password?token=${token}`
        await this.transporter.sendMail({
            from: 'formationdev61@gmail.com',
            to: mail,
            subject: 'changement mot de passe',
            text: `Cliquez ici pour changer le mot de passe : ${link}`,
            html: `<a href="${link}">Changer le mot de passe</a>`
        })
    }
}
