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

  if (req.cookies && req.cookies[CONSTANTS.AUTH_COOKIE_NAME]) {
    const tokenParts = req.cookies[CONSTANTS.AUTH_COOKIE_NAME].split(' ');
    if (!tokenParts || tokenParts[0] !== 'Bearer' || !tokenParts[1]) throw new UnauthorizedException('bad_token');
    const user = jwt.decode(tokenParts[1], { json: true });

    if (user) return user;
  }

  throw new UnauthorizedException('bad_token');
});
