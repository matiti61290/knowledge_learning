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
import type { RequestHandler } from 'express';

async function bootstrap() {
  dotenv.config();

  const server = express();

  server.use('/payment/webhook', bodyParser.raw({ type: 'application/json' }));

  const corsMiddleware: RequestHandler = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://knowledge-learning-1-7gl2.onrender.com');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-csrf-token'
    );
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }

    next();
  };


  server.use(corsMiddleware);

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.use(cookieParser());

  server.use((req, res, next) => {
    console.log(`Request ${req.method} ${req.url}`);
    next();
  });

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: false,
  });

  app.enableCors({
    origin: 'https://knowledge-learning-1-7gl2.onrender.com',
    credentials: true,
  });

  await app.init();

  const port = process.env.PORT || 3001;
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}
bootstrap();



