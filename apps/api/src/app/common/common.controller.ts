import { Body, Controller, Post, Get, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { ValidRequestDto, SignedUrlDto, ImportConfigResponseDto } from './dtos';
import { ValidRequestCommand, GetSignedUrl, ValidRequest, GetImportConfig } from './usecases';

@ApiTags('Common')
@Controller('/common')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(JwtAuthGuard)
export class CommonController {
  constructor(
    private validRequest: ValidRequest,
    private getSignedUrl: GetSignedUrl,
    private getImportConfig: GetImportConfig
  ) {}

  @Post('/valid')
  @ApiOperation({
    summary: 'Check if request is valid (Checks Auth)',
  })
  async isRequestValid(@Body() body: ValidRequestDto): Promise<{ success: boolean }> {
    return this.validRequest.execute(
      ValidRequestCommand.create({
        projectId: body.projectId,
        templateId: body.template,
      })
    );
  }

  @Post('/signed-url')
  @ApiOperation({
    summary: 'Get signed url for the filename',
  })
  @ApiExcludeEndpoint()
  async getSignedUrlRoute(@Body() body: SignedUrlDto): Promise<string> {
    return this.getSignedUrl.execute(body.key);
  }

  @Get('/import-config')
  @ApiOperation({
    summary: 'Get import config',
  })
  async getImportConfigRoute(@Query('projectId') projectId: string): Promise<ImportConfigResponseDto> {
    if (!projectId) {
      throw new BadRequestException();
    }

    return this.getImportConfig.execute(projectId);
  }
}
