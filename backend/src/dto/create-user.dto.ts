import { ArrayNotEmpty, IsArray, IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from "class-validator";

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
    @MinLength(6)
    password: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    roleIds: number[];
}