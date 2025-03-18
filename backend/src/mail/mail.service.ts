import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.PASSWORD_MAIL
        }
    });

    async sendVerificationMail(mail: string, token: string) {
        const link = `http://localhost:3000/register/validation?token=${token}`
        await this.transporter.sendMail({
            from: 'formationdev61@gmail.com',
            to: mail,
            subject: 'Confirmation de compte',
            text: `Cliquez ici pour valider l'activation du compte : ${link}`,
            html: `<a href="${link}">Activer mon compte</a>`
        })
    }
}
