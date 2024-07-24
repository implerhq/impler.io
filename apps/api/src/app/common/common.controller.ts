import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiSecurity, ApiExcludeEndpoint, ApiConsumes } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { ACCESS_KEY_NAME } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { ValidRequestDto, SignedUrlDto, ImportConfigResponseDto } from './dtos';
import { ValidImportFile } from '@shared/validations/valid-import-file.validation';
import { ValidRequestCommand, GetSignedUrl, ValidRequest, GetImportConfig, GetSheetNames } from './usecases';

@ApiTags('Common')
@Controller('/common')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(JwtAuthGuard)
export class CommonController {
  constructor(
    private validRequest: ValidRequest,
    private getSignedUrl: GetSignedUrl,
    private getSheetNames: GetSheetNames,
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
        templateId: body.templateId,
        schema: body.schema,
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
  async getImportConfigRoute(
    @Query('projectId') projectId: string,
    @Query('templateId') templateId: string
  ): Promise<ImportConfigResponseDto> {
    if (!projectId) {
      throw new BadRequestException();
    }

    return await this.getImportConfig.execute(projectId, templateId);
  }

  @Post('/sheet-names')
  @ApiOperation({
    summary: 'Get sheet names for user selected file',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async getSheetNamesRoute(@UploadedFile('file', ValidImportFile) file: Express.Multer.File): Promise<string[]> {
    return this.getSheetNames.execute({ file });
  }
}
