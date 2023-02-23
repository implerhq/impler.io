import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { APIKeyGuard } from '@shared/framework/auth.gaurd';
import { ValidRequestDto, SignedUrlDto } from './dtos';
import { ValidRequestCommand, GetSignedUrl, ValidRequest } from './usecases';

@Controller('/common')
@ApiTags('Common')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(APIKeyGuard)
export class CommonController {
  constructor(private validRequest: ValidRequest, private getSignedUrl: GetSignedUrl) {}

  @Post('/valid')
  @ApiOperation({
    summary: 'Check if request is valid (Checks Auth)',
  })
  async isRequestValid(@Body() body: ValidRequestDto): Promise<boolean> {
    return this.validRequest.execute(
      ValidRequestCommand.create({
        projectId: body.projectId,
        template: body.template,
      })
    );
  }

  @Post('/signed-url')
  @ApiOperation({
    summary: 'Get signed url for the filename',
  })
  async getSignedUrlRoute(@Body() body: SignedUrlDto): Promise<string> {
    return this.getSignedUrl.execute(body.key);
  }
}
