import './config';

import * as Sentry from '@sentry/node';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { SentryFilter } from './app/shared/filters/exception.filter';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { validateEnv } from './config/env-validator';

validateEnv();

const extendedBodySizeRoutes = [
  '/v1/template/:templateId/sample',
  '/v1/upload/:templateId',
  '/v1/common/valid',
  '/v1/template/:templateId/columns',
];

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
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.use(cookieParser());
  app.use(extendedBodySizeRoutes, bodyParser.json({ limit: '20mb' }));
  app.use(extendedBodySizeRoutes, bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(compression());

  // Security headers middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // Only expose Swagger in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Impler API')
      .setDescription('The Impler API description')
      .setVersion('1.0')
      .addApiKey(
        {
          type: 'apiKey',
          name: ACCESS_KEY_NAME,
          in: 'header',
        },
        ACCESS_KEY_NAME
      )
      .addTag('Project')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api', app, document);
  }

  if (process.env.SENTRY_DSN) {
    Sentry.init({
      tracesSampleRate: 1.0,
      dsn: process.env.SENTRY_DSN,
      integrations: [new Sentry.Integrations.Console({ tracing: true })],
    });
  }

  // Always register exception filter (with or without Sentry)
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  if (expressApp) {
    await app.init();
  } else {
    await app.listen(process.env.PORT);
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  Logger.log(`Started application in NODE_ENV=${process.env.NODE_ENV} on port ${process.env.PORT}`);

  return app;
}

const corsOptionsDelegate = function (req, callback) {
  const allowedOrigins = [process.env.WIDGET_BASE_URL, process.env.WEB_BASE_URL].filter(Boolean);
  const corsOptions = {
    credentials: true,
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'x-openreplay-session-token', ACCESS_KEY_NAME, 'sentry-trace', 'baggage'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  callback(null, corsOptions);
};
