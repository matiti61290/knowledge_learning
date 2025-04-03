import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization

        if(!authHeader){
            throw new ForbiddenException('Aucun token fourni')
        }

        const token = authHeader.split(' ')[1]

        try{
            const decoded = this.jwtService.verify(token)
            req.user = decoded
            next()
        } catch (error) {
            throw new ForbiddenException('Token invalide')
        }
    }
}