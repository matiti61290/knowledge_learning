import { IsNotEmpty, IsString, Matches } from "class-validator";
import { Match } from "./decorators/match.decorator";

export class NewPasswordDto{
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Le mot de passe doit contenir au moins 8 caracteres, une majuscule, un chiffre et un caractere special'
    })
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    @Match('password', {message: "Les mots de passe ne correspondent pas"})
    confirmPassword: string
}