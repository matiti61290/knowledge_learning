import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { generateCsrfToken } from '../middlewares/csrf.middleware';
import { randomUUID } from 'crypto';

@Controller('csrf')
export class CsrfController {
  @Get('token')
  getToken(@Req() req: Request, @Res() res: Response) {
    //If no cookies 'session-id', create one
    if(!req.cookies['session-id']){
      const sessionId = randomUUID()
      res.cookie('session-id', sessionId, {
        sameSite:'strict',
        path:'/',
        secure:false,
        httpOnly:false
      })
      req.cookies['session-id'] = sessionId
    }
    
    const token = generateCsrfToken(req, res);
    return res.json({ csrfToken: token });
  }
}
