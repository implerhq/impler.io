import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { RegisterUserDto } from './dtos';
import { IJwtPayload } from '@impler/shared';
import { IStrategyResponse } from '@shared/types/auth.types';
import { CONSTANTS, COOKIE_CONFIG } from '@shared/constants';
import { UserSession } from '@shared/framework/user.decorator';
import { ApiException } from '@shared/exceptions/api.exception';
import { StrategyUser } from './decorators/strategy-user.decorator';
import { RegisterUser, RegisterUserCommand } from './usecases';

@ApiTags('Auth')
@Controller('/auth')
@ApiExcludeController()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private registerUser: RegisterUser) {}

  @Get('/github')
  githubAuth() {
    if (!process.env.GITHUB_OAUTH_CLIENT_ID || !process.env.GITHUB_OAUTH_CLIENT_SECRET) {
      throw new ApiException(
        'GitHub auth is not configured, please provide GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET as env variables'
      );
    }

    return {
      success: true,
    };
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@StrategyUser() strategyUser: IStrategyResponse, @Res() response: Response) {
    if (!strategyUser || !strategyUser.token) {
      return response.redirect(`${process.env.WEB_BASE_URL}/signin?error=AuthenticationError`);
    }

    let url = process.env.WEB_BASE_URL + '/signin';
    const queryObj: Record<string, any> = {
      token: strategyUser.token,
    };
    if (strategyUser.showAddProject) {
      queryObj.showAddProject = true;
    }
    for (const key in queryObj) {
      if (queryObj.hasOwnProperty(key)) {
        url += `${url.includes('?') ? '&' : '?'}${key}=${queryObj[key]}`;
      }
    }

    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, strategyUser.token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    return response.redirect(url);
  }

  @Get('/user')
  async user(@UserSession() user: IJwtPayload) {
    return user;
  }

  @Get('/logout')
  logout(@Res() response: Response) {
    response.clearCookie(CONSTANTS.AUTH_COOKIE_NAME);

    response.contentType('text').send();
  }

  @Post('/register')
  async register(@Body() body: RegisterUserDto) {
    return this.registerUser.execute(RegisterUserCommand.create(body));
  }
}
