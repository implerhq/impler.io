import './config';

import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { validateEnv } from './config/env-validator';

validateEnv();

const extendedBodySizeRoutes = ['/v1/template/:templateId/sample', '/v1/upload/:templateId', '/v1/common/valid'];

export async function bootstrap(expressApp?): Promise<INestApplication> {
  let app;
  if (expressApp) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  } else {
    app = await NestFactory.create(AppModule);
  }

  app.enableCors(corsOptionsDelegate);

  app.setGlobalPrefix('v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.use(cookieParser());
  app.use(extendedBodySizeRoutes, bodyParser.json({ limit: '20mb' }));
  app.use(extendedBodySizeRoutes, bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(compression());

  const options = new DocumentBuilder()
    .setTitle('Impler API')
    .setDescription('The Impler API description')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey', // type
        name: ACCESS_KEY_NAME, // Name of the key to expect in header
        in: 'header',
      },
      ACCESS_KEY_NAME // Name to show and used in swagger
    )
    .addTag('Project')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  if (expressApp) {
    await app.init();
  } else {
    await app.listen(process.env.PORT);
  }

  Logger.log(`Started application in NODE_ENV=${process.env.NODE_ENV} on port ${process.env.PORT}`);

  return app;
}

const corsOptionsDelegate = function (req, callback) {
  const corsOptions = {
    credentials: true,
    origin: [process.env.WIDGET_BASE_URL, process.env.WEB_BASE_URL],
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'x-openreplay-session-token', ACCESS_KEY_NAME, 'sentry-trace', 'baggage'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  callback(null, corsOptions);
};
