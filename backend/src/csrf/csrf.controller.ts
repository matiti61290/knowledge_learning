import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { generateCsrfToken } from '../middlewares/csrf.middleware';

@Controller('csrf')
export class CsrfController {
  @Get('token')
  getToken(@Req() req: Request, @Res() res: Response) {
    const token = generateCsrfToken(req, res);
    return res.json({ csrfToken: token });
  }
}
