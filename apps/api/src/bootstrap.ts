import './config';

import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validateEnv } from './config/env-validator';

// Validate the ENV variables after launching SENTRY, so missing variables will report to sentry
validateEnv();

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

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(compression());

  const options = new DocumentBuilder()
    .setTitle('Impler API')
    .setDescription('The Impler API description')
    .setVersion('1.0')
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
    origin: false as boolean | string | string[],
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  if (['dev', 'test', 'local'].includes(process.env.NODE_ENV)) {
    corsOptions.origin = '*';
  } else {
    corsOptions.origin = [process.env.FRONT_BASE_URL];
  }
  callback(null, corsOptions);
};
