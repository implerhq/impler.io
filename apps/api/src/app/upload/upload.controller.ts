// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import _whatever from 'multer';
import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiSecurity, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UploadStatusEnum } from '@impler/shared';
import { UploadEntity } from '@impler/dal';

import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { UploadRequestDto } from './dtos/upload-request.dto';
import { ValidImportFile } from '../shared/validations/valid-import-file.validation';
import { MakeUploadEntry } from './usecases/make-upload-entry/make-upload-entry.usecase';
import { MakeUploadEntryCommand } from './usecases/make-upload-entry/make-upload-entry.command';
import { ValidateMongoId } from '../shared/validations/valid-mongo-id.validation';
import { GetUpload } from './usecases/get-upload/get-upload.usecase';
import { GetUploadCommand } from './usecases/get-upload/get-upload.command';
import { DoMapping } from './usecases/do-mapping/do-mapping.usecase';
import { DoMappingCommand } from './usecases/do-mapping/do-mapping.command';
import { GetUploads } from './usecases/get-uploads/get-uploads.usecase';
import { GetUploadsCommand } from './usecases/get-uploads/get-uploads.command';

@Controller('/upload')
@ApiTags('Uploads')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class UploadController {
  constructor(
    private makeUploadEntry: MakeUploadEntry,
    private getUpload: GetUpload,
    private doMapping: DoMapping,
    private getUploads: GetUploads
  ) {}

  @Post('')
  @ApiOperation({
    summary: `Upload file to template`,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile('file', ValidImportFile) file: Express.Multer.File, @Body() body: UploadRequestDto) {
    return await this.makeUploadEntry.execute(
      MakeUploadEntryCommand.create({
        file: file,
        templateId: body.template,
        extra: body.extra,
        authHeaderValue: body.authHeaderValue,
      })
    );
  }

  @Get(':templateId')
  @ApiOperation({
    summary: 'Get upload information for template',
  })
  async getUploadsInformation(@Param('templateId', ValidateMongoId) templateId: string): Promise<UploadEntity[]> {
    return this.getUploads.execute(
      GetUploadsCommand.create({
        _templateId: templateId,
      })
    );
  }

  @Get('mapping/:uploadId')
  @ApiOperation({
    summary: 'Get mapping information for uploaded file',
  })
  async getMappingInformation(@Param('uploadId', ValidateMongoId) uploadId: string) {
    const uploadInformation = await this.getUpload.execute(
      GetUploadCommand.create({
        uploadId,
        select: 'status headings _templateId',
      })
    );

    if (uploadInformation.status === UploadStatusEnum.UPLOADED) {
      await this.doMapping.execute(
        DoMappingCommand.create({
          headings: uploadInformation.headings,
          _templateId: uploadInformation._templateId,
          _uploadId: uploadId,
        })
      );
    }

    return 'Done';
    /*
     * Check if upload status
     * if status = Uploaded => Do Mapping
     *                      => Change status to Mapping
     * return mapping
     */
  }
}
