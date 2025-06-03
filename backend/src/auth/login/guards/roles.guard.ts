import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

/**
 * Vérifie si l'utilisateur a accès a une route a partir de son rôle
 * @param {token} - contient les informations dont le rôle de l'utilisateur. Il est genéré au moment de la connexion dans le fichier login.service
 * @returns {boolean} - retourne une autorisation (true) ou un refus (false) en fonction du rôle de l'utilisateur
 * 
 * Exceptions: 
 * - **ForbiddenException** : si aucun token n'est fourni, si l'utilisateur n'a pas le rôle requis pour accéder à cette route ou si le token est invalide
 */
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

        const token = request.cookies?.access_token

        if(!token) {
            throw new ForbiddenException('Aucun token fourni')
        }

        try{
            const decoded = this.jwtService.verify(token)
            const userRoles = decoded.role

            if ( !userRoles || !requiredRoles.some(role => userRoles.includes(role)) ) {
                throw new ForbiddenException("Vous n'avez pas acces a cette route")
            }

            request.user = decoded

            return true
        } catch(error) {
            throw new ForbiddenException('Token invalide')
        }
    }
}