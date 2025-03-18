import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { Match } from "./decorators/match.decorator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsEmail()
    mail: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Le mot de passe doit contenir au moins 8 caracteres, une majuscule, un chiffre et un caractere special'
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @Match('password', {message: "Les mots de passe ne correspondent pas"})
    confirmPassword: string
}