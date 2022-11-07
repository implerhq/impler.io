import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { ACCESS_KEY_NAME } from '@impler/shared';

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
