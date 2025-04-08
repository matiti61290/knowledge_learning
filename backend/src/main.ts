import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config()

  const server = express()

  server.post('/payment/webhook', bodyParser.raw({ type: 'application/json' }))
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), { cors: false});

  await app.init()
  await app.listen(process.env.PORT || 3000);
}
bootstrap();