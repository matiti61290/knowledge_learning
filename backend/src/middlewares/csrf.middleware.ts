import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrf } from 'csrf-csrf';
 

const {
  doubleCsrfProtection,
  generateCsrfToken
} = doubleCsrf({
  getSecret: () => 'une cle', // mettre une vraie cle
  getSessionIdentifier: (req: Request) => {
    return req.cookies['session-id'] || 'anonymous';
  },
  cookieName: 'x-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: false //Pensez a mettre TRUE en prod
  },
});

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    doubleCsrfProtection(req, res, (err) => {
      if (err) {
        throw new UnauthorizedException('Invalid CSRF Token');
      }
      next();
    });
  }
}

export { generateCsrfToken };
