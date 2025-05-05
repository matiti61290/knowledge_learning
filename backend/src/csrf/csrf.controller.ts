import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express'

@Controller('csrf')
export class CsrfMiddleware {
    @Get('token')
    getToken(@Req() req: Request, @Res() res: Response) {
        return res.json({ message: 'CSRF token set in cookie'})
    }
}