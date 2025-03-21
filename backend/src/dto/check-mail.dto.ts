import { IsEmail, IsNotEmpty } from 'class-validator'

export class CheckMailDto {

    @IsNotEmpty()
    @IsEmail()
    mail:string
}