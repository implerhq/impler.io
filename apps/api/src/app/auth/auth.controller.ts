import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { ClassSerializerInterceptor, Controller, Get, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { IJwtPayload } from '@impler/shared';
import { IStrategyResponse } from '@shared/types/auth.types';
import { CONSTANTS, COOKIE_CONFIG } from '@shared/constants';
import { UserSession } from '@shared/framework/user.decorator';
import { ApiException } from '@shared/exceptions/api.exception';
import { StrategyUser } from './decorators/strategy-user.decorator';

@ApiTags('Auth')
@Controller('/auth')
@ApiExcludeController()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
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
      return response.redirect(`${process.env.CLIENT_SUCCESS_AUTH_REDIRECT}?error=AuthenticationError`);
    }

    const url = process.env.CLIENT_SUCCESS_AUTH_REDIRECT;

    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, strategyUser.token, COOKIE_CONFIG);

    return response.redirect(url);
  }

  @Get('/user')
  async user(@UserSession() user: IJwtPayload) {
    return user;
  }
}
