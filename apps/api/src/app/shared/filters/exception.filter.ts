import { Catch, ArgumentsHost, HttpServer, HttpException } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    // Only report non-HTTP exceptions (unexpected errors) to Sentry
    if (!(exception instanceof HttpException)) {
      Sentry.captureException(exception);
    }
    super.catch(exception, host);
  }

  handleUnknownError(
    exception: any,
    host: ArgumentsHost,
    applicationRef: HttpServer<any, any> | AbstractHttpAdapter<any, any, any>
  ): void {
    Sentry.captureException(exception);
    super.handleUnknownError(exception, host, applicationRef);
  }
}
