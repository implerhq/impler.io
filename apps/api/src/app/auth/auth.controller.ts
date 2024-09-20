import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { IJwtPayload } from '@impler/shared';
import { AuthService } from './services/auth.service';
import { IStrategyResponse } from '@shared/types/auth.types';
import { CONSTANTS, COOKIE_CONFIG } from '@shared/constants';
import { UserSession } from '@shared/framework/user.decorator';
import { ApiException } from '@shared/exceptions/api.exception';
import { StrategyUser } from './decorators/strategy-user.decorator';
import {
  RegisterUserDto,
  LoginUserDto,
  RequestForgotPasswordDto,
  ResetPasswordDto,
  OnboardUserDto,
  VerifyDto,
  UpdateUserDto,
} from './dtos';
import {
  Verify,
  LoginUser,
  ResendOTP,
  UpdateUser,
  OnboardUser,
  RegisterUser,
  ResetPassword,
  LoginUserCommand,
  RegisterUserCommand,
  ResetPasswordCommand,
  RequestForgotPassword,
  RequestForgotPasswordCommand,
} from './usecases';

@ApiTags('Auth')
@Controller('/auth')
@ApiExcludeController()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private verify: Verify,
    private resendOTP: ResendOTP,
    private loginUser: LoginUser,
    private updateUser: UpdateUser,
    private onboardUser: OnboardUser,
    private authService: AuthService,
    private registerUser: RegisterUser,
    private resetPassword: ResetPassword,
    private requestForgotPassword: RequestForgotPassword
  ) {}

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
      return response.redirect(`${process.env.WEB_BASE_URL}/auth/signin?error=AuthenticationError`);
    }

    let url = process.env.WEB_BASE_URL + '/auth/signin';
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

  @Get('/me')
  async user(@UserSession() user: IJwtPayload) {
    return user;
  }

  @Put('/me')
  async updateUserRoute(@UserSession() user: IJwtPayload, @Body() body: UpdateUserDto, @Res() response: Response) {
    const { success, token } = await this.updateUser.execute(user._id, body);
    if (token)
      response.cookie(CONSTANTS.AUTH_COOKIE_NAME, token, {
        ...COOKIE_CONFIG,
        domain: process.env.COOKIE_DOMAIN,
      });

    response.send({ success });
  }

  @Get('/logout')
  logout(@Res() response: Response) {
    response.clearCookie(CONSTANTS.AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: process.env.COOKIE_DOMAIN,
    });

    response.contentType('text').send();
  }

  @Post('/register')
  async register(@Body() body: RegisterUserDto, @Res() response: Response) {
    const registeredUser = await this.registerUser.execute(RegisterUserCommand.create(body));

    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, registeredUser.token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    response.send(registeredUser);
  }

  @Post('/verify')
  async verifyRoute(@Body() body: VerifyDto, @UserSession() user: IJwtPayload, @Res() response: Response) {
    const { token, screen } = await this.verify.execute(user._id, { code: body.otp });
    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    response.send({ screen });
  }

  @Post('/onboard')
  async onboardUserRoute(
    @Body() body: OnboardUserDto,
    @UserSession() user: IJwtPayload,
    @Res({ passthrough: true }) res: Response
  ) {
    const projectWithEnvironment = await this.onboardUser.execute(
      {
        _userId: user._id,
        projectName: body.projectName,
        role: body.role,
        companySize: body.companySize,
        source: body.source,
      },
      user.email
    );
    const token = this.authService.getSignedToken(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
        accessToken: projectWithEnvironment.environment.apiKeys[0].key,
      },
      projectWithEnvironment.project._id
    );
    res.cookie(CONSTANTS.AUTH_COOKIE_NAME, token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    return projectWithEnvironment;
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto, @Res() response: Response) {
    const loginUser = await this.loginUser.execute(
      LoginUserCommand.create({
        email: body.email,
        password: body.password,
      })
    );

    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, loginUser.token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    response.send(loginUser);
  }

  @Post('/forgot-password/request')
  async requestForgotPasswordRoute(@Body() body: RequestForgotPasswordDto) {
    return this.requestForgotPassword.execute(RequestForgotPasswordCommand.create(body));
  }

  @Post('/forgot-password/reset')
  async resetPasswordRoute(@Body() body: ResetPasswordDto, @Res() response: Response) {
    const resetPassword = await this.resetPassword.execute(ResetPasswordCommand.create(body));

    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, resetPassword.token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    response.send(resetPassword);
  }

  @Post('verify/resend')
  async resendOTPRoute(@UserSession() user: IJwtPayload) {
    return await this.resendOTP.execute(user._id);
  }
}
