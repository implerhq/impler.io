// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import _whatever from 'multer';
import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiSecurity, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { UploadEntity } from '@impler/dal';

import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { UploadRequestDto } from './dtos/upload-request.dto';
import { ValidImportFile } from '../shared/validations/valid-import-file.validation';
import { MakeUploadEntry } from './usecases/make-upload-entry/make-upload-entry.usecase';
import { MakeUploadEntryCommand } from './usecases/make-upload-entry/make-upload-entry.command';
import { ValidateMongoId } from '../shared/validations/valid-mongo-id.validation';
import { GetUpload } from '../shared/usecases/get-upload/get-upload.usecase';
import { GetUploadCommand } from '../shared/usecases/get-upload/get-upload.command';
import { GetUploads } from './usecases/get-uploads/get-uploads.usecase';
import { GetUploadsCommand } from './usecases/get-uploads/get-uploads.command';
import { ValidateTemplate } from '../shared/validations/valid-template.validation';

@Controller('/upload')
@ApiTags('Uploads')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(APIKeyGuard)
export class UploadController {
  constructor(private makeUploadEntry: MakeUploadEntry, private getUpload: GetUpload, private getUploads: GetUploads) {}

  @Post(':template')
  @ApiOperation({
    summary: `Upload file to template`,
  })
  @ApiParam({
    name: 'template',
    required: true,
    description: 'ID or CODE of the template',
    type: 'string',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile('file', ValidImportFile) file: Express.Multer.File,
    @Body() body: UploadRequestDto,
    @Param('template', ValidateTemplate) templateId: string
  ) {
    return await this.makeUploadEntry.execute(
      MakeUploadEntryCommand.create({
        file: file,
        templateId,
        extra: body.extra,
        authHeaderValue: body.authHeaderValue,
      })
    );
  }

  @Get(':templateId')
  @ApiOperation({
    summary: 'Get uploads information for template',
  })
  async getUploadsInformation(@Param('templateId', ValidateMongoId) templateId: string): Promise<UploadEntity[]> {
    return this.getUploads.execute(
      GetUploadsCommand.create({
        _templateId: templateId,
      })
    );
  }

  @Get(':uploadId/headings')
  @ApiOperation({
    summary: 'Get headings for the uploaded file',
  })
  async getHeadings(@Param('uploadId', ValidateMongoId) uploadId: string): Promise<string[]> {
    const uploadInfo = await this.getUpload.execute(
      GetUploadCommand.create({
        uploadId,
        select: 'headings',
      })
    );

    return uploadInfo.headings;
  }
}
