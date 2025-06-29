import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrf } from 'csrf-csrf';
 

const {
  doubleCsrfProtection,
  generateCsrfToken
} = doubleCsrf({
  getSecret: () => 'OneKey', // mettre une vraie cle
  getSessionIdentifier: (req: Request) => {
    return req.cookies['session-id'] || 'anonymous';
  },
  cookieName: 'x-csrf-token',
  cookieOptions: {
    sameSite: 'none',
    path: '/',
    secure: true //in prod only
  },
});

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    doubleCsrfProtection(req, res, (err) => {
      if (err) {
        throw new UnauthorizedException('Invalid CSRF Token', err.message);
      }
      next();
    });
  }

}

export { generateCsrfToken };
