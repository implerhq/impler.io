import { ExecutionContext, Injectable, CanActivate, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { CONSTANTS } from '@shared/constants';
import { AuthService } from 'app/auth/services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

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
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(forwardRef(() => AuthService)) private authService: AuthService, private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (req.headers && req.headers[ACCESS_KEY_NAME]) {
      const accessKey = req.headers[ACCESS_KEY_NAME];

      const tokenResult = await this.authService.apiKeyAuthenticate(accessKey);
      req.cookies = {
        ...(req.cookies || {}),
        [CONSTANTS.AUTH_COOKIE_NAME]: tokenResult,
      };

      return true;
    } else if (req.cookies && req.cookies[CONSTANTS.AUTH_COOKIE_NAME]) {
      try {
        await this.jwtService.verifyAsync(req.cookies[CONSTANTS.AUTH_COOKIE_NAME].replace('Bearer ', ''), {
          secret: process.env.JWT_SECRET as string,
        });

        return true;
      } catch (err) {}
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

    if (req.headers[ACCESS_KEY_NAME]) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
