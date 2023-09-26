import { Response } from 'express';
import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RegenerateAPIKey } from './usecases';
import { IJwtPayload } from '@impler/shared';
import { UserSession } from '@shared/framework/user.decorator';
import { CONSTANTS, COOKIE_CONFIG } from '@shared/constants';

@Controller('/environment')
@ApiTags('Environment')
@ApiExcludeController()
export class EnvironmentController {
  constructor(private regenerateAPIKey: RegenerateAPIKey) {}

  @Get('api-keys/regenerate')
  @ApiOperation({
    summary: 'Regenerate API key',
  })
  async regenerateApiKey(@UserSession() user: IJwtPayload, @Res() response: Response) {
    const { token, accessToken } = await this.regenerateAPIKey.execute(user);
    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    return response.send({ accessToken });
  }
}
