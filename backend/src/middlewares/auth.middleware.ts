import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies?.access_token;
    
        if (!token) {
            throw new ForbiddenException('Aucun token fourni');
        }
    
        try {
            const decoded = this.jwtService.verify(token);
            console.log(decoded)
            req.user = decoded;
            next();
        } catch (error) {
            throw new ForbiddenException('Token invalide');
        }
    }
}