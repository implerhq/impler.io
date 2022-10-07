import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class APIKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.access_key;
    const API_KEY = process.env.ACCESS_KEY;

    if (API_KEY) {
      return API_KEY === authorizationHeader;
    }

    return true;
  }
}
