// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
// import * as express from 'express';
// import * as bodyParser from 'body-parser';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import * as cookieParser from 'cookie-parser';
// import * as cors from 'cors';

// async function bootstrap() {
//   dotenv.config();

//   const server = express();

//   server.use('/payment/webhook', bodyParser.raw({ type: 'application/json' }));

//   server.use(cookieParser());
//   server.use((req, res, next) => {
//   console.log(`Request ${req.method} ${req.url}`);
//   next();
// });
//   server.use(cors({
//     origin: 'https://knowledge-learning-1-7gl2.onrender.com',
//     credentials: true,
//   }));

//   server.use(bodyParser.json());
//   server.use(bodyParser.urlencoded({ extended: true }));

//   const app = await NestFactory.create(AppModule, new ExpressAdapter(server), { cors: false });

//   await app.init();
//   await app.listen(process.env.PORT || 3001);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config();

  const server = express();

  // Stripe raw body (uniquement pour webhook Stripe)
  server.use('/payment/webhook', bodyParser.raw({ type: 'application/json' }));

  // Body parsing standard pour toutes les autres routes
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Cookies
  server.use(cookieParser());

  // Logger pour debug
  server.use((req, res, next) => {
    console.log(`Request ${req.method} ${req.url}`);
    next();
  });

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: false, // on le gère manuellement ensuite
  });

  // Activer CORS avec NestJS
  app.enableCors({
    origin: 'https://knowledge-learning-1-7gl2.onrender.com',
    credentials: true,
  });

  await app.init();

  // 🎯 Lancement du serveur Express (PAS app.listen)
  const port = process.env.PORT || 3001;
  server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}
bootstrap();
