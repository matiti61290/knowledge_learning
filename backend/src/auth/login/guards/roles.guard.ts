import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
        if (!requiredRoles) {
            return true
        }

        const request = context.switchToHttp().getRequest<Request>()
        const authHeader = request.headers.authorization
        console.log('authHeader: ', authHeader)

        if(!authHeader) {
            throw new ForbiddenException('Aucun token fourni')
        }

        const token = authHeader.split(' ')[1]

        try{
            const decoded = this.jwtService.verify(token)
            console.log('decoded token: ', decoded)
            const userRoles = decoded.role

            if ( !userRoles || !requiredRoles.some(role => userRoles.includes(role)) ) {
                throw new ForbiddenException("Vous n'avez pas acces a cette route")
            }

            return true
        } catch(error) {
            throw new ForbiddenException('Token invalide')
        }
    }
}