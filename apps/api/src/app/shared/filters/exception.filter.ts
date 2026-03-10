import { Catch, ArgumentsHost, HttpServer, HttpException, Logger } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(SentryFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    // Only report non-HTTP exceptions (unexpected errors) to Sentry
    if (!(exception instanceof HttpException)) {
      Sentry.captureException(exception);
    }

    // In production, normalize unexpected error responses to avoid leaking internals
    if (process.env.NODE_ENV === 'production' && !(exception instanceof HttpException)) {
      this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception));
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      if (response && typeof response.status === 'function') {
        response.status(500).json({
          statusCode: 500,
          message: 'Internal server error',
        });

        return;
      }
    }

    super.catch(exception, host);
  }

  handleUnknownError(
    exception: any,
    host: ArgumentsHost,
    applicationRef: HttpServer<any, any> | AbstractHttpAdapter<any, any, any>
  ): void {
    Sentry.captureException(exception);

    // In production, normalize unknown errors
    if (process.env.NODE_ENV === 'production') {
      this.logger.error('Unknown error', exception?.stack || String(exception));
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      if (response && typeof response.status === 'function') {
        response.status(500).json({
          statusCode: 500,
          message: 'Internal server error',
        });

        return;
      }
    }

    super.handleUnknownError(exception, host, applicationRef);
  }
}
