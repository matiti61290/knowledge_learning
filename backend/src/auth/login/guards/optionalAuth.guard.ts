import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token;

    if (!token) {
      // Pas de token, mais on laisse passer quand même
      return true;
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
    } catch (e) {
      // Token invalide, on ignore et on laisse passer (ou tu peux logger)
    }

    return true;
  }
}