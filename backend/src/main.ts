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

  // ✅ Stripe webhook: raw body nécessaire
  server.use('/payment/webhook', bodyParser.raw({ type: 'application/json' }));

  // ✅ Middleware pour résoudre les problèmes CORS précoces (OPTIONS)
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://knowledge-learning-1-7gl2.onrender.com');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-csrf-token'
    );
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });

  // ✅ Body parsing standard pour tout le reste
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // ✅ Cookies
  server.use(cookieParser());

  // ✅ Logger simple
  server.use((req, res, next) => {
    console.log(`Request ${req.method} ${req.url}`);
    next();
  });

  // ✅ Création de l'app Nest
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: false, // on configure CORS manuellement
  });

  // ✅ CORS depuis Nest (doit venir *avant* app.init())
  app.enableCors({
    origin: 'https://knowledge-learning-1-7gl2.onrender.com',
    credentials: true,
  });

  await app.init();

  // ✅ Render attend qu'on écoute sur process.env.PORT
  const port = process.env.PORT || 3001;
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

bootstrap();

