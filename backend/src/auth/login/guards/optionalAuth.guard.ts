import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token;

    //Check if a token exists, but doesn't block the user
    if (!token) {
      return true;
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
    } catch (e) {
      request.user = undefined;
    }

    return true;
  }
}