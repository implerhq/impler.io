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
import { IJwtPayload } from '@impler/shared';
import { IStrategyResponse } from '@shared/types/auth.types';
import { UserSession } from '@shared/framework/user.decorator';
import { ApiException } from '@shared/exceptions/api.exception';
import { StrategyUser } from './decorators/strategy-user.decorator';
import { CONSTANTS, COOKIE_CONFIG } from '@shared/constants';
import { RegisterUserDto } from './dtos/register-user.dto';
import { RegisterUser, RegisterUserCommand } from './usecases';

@ApiTags('Auth')
@Controller('/auth')
@ApiExcludeController()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private registerUser: RegisterUser) {}

  @Post('/register')
  async registerUserAPI(@Body() registerData: RegisterUserDto, @Res({ passthrough: true }) response: Response) {
    const registerationResponse = await this.registerUser.execute(
      RegisterUserCommand.create({
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        password: registerData.password,
      })
    );

    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, registerationResponse.token, COOKIE_CONFIG);
  }

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

    let url = process.env.CLIENT_SUCCESS_AUTH_REDIRECT;
    if (strategyUser.userCreated && strategyUser.showAddProject) {
      url += `?showAddProject=true`;
    }

    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, strategyUser.token, COOKIE_CONFIG);

    return response.redirect(url);
  }

  @Get('/user')
  async user(@UserSession() user: IJwtPayload) {
    return user;
  }
}
