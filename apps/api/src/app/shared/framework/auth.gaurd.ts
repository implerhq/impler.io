import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { CONSTANTS } from '@shared/constants';

@Injectable()
export class APIKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers[ACCESS_KEY_NAME];
    const API_KEY =
      process.env[String(ACCESS_KEY_NAME).toLowerCase()] || process.env[String(ACCESS_KEY_NAME).toUpperCase()];

    if (API_KEY && API_KEY !== authorizationHeader) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if ((req.cookies && req.cookies[CONSTANTS.AUTH_COOKIE_NAME]) || req.headers[CONSTANTS.ACCESS_KEY_NAME]) {
      return true;
    }

    throw new UnauthorizedException();
  }
}

@Injectable()
export class WebAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (req.cookies && req.cookies[CONSTANTS.AUTH_COOKIE_NAME]) {
      return true;
    }

    throw new UnauthorizedException();
  }
}

@Injectable()
export class WidgetAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (req.headers[CONSTANTS.ACCESS_KEY_NAME]) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
