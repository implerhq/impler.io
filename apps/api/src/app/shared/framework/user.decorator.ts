/* eslint-disable no-magic-numbers */
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { CONSTANTS } from '@shared/constants';

export const UserSession = createParamDecorator((data, ctx) => {
  let req: Request;
  if (ctx.getType() === 'graphql') {
    req = ctx.getArgs()[2].req;
  } else {
    req = ctx.switchToHttp().getRequest();
  }

  if (req.cookies && typeof req.cookies[CONSTANTS.AUTH_COOKIE_NAME] === 'string') {
    const tokenParts = req.cookies[CONSTANTS.AUTH_COOKIE_NAME].split(' ');
    if (!tokenParts || tokenParts[0] !== 'Bearer' || !tokenParts[1]) throw new UnauthorizedException('bad_token');

    try {
      // Verify the JWT signature before trusting its claims
      const user = jwt.verify(tokenParts[1], process.env.JWT_SECRET as string, { algorithms: ['HS256'] });

      if (user) return user;
    } catch (err) {
      throw new UnauthorizedException('invalid_token');
    }
  }

  throw new UnauthorizedException('bad_token');
});
