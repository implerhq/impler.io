// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import _whatever from 'multer';
import { Response } from 'express';
import { FileEntity } from '@impler/dal';
import { FileInterceptor } from '@nestjs/platform-express';
import { ACCESS_KEY_NAME, Defaults, UploadStatusEnum } from '@impler/shared';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { validateNotFound } from '@shared/helpers/common.helper';
import { validateUploadStatus } from '@shared/helpers/upload.helpers';
import { PaginationResponseDto } from '@shared/dtos/pagination-response.dto';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { ValidImportFile } from '@shared/validations/valid-import-file.validation';
import { GetUploadCommand } from '@shared/usecases/get-upload/get-upload.command';
import { ValidateTemplate } from '@shared/validations/valid-template.validation';

import { UploadRequestDto } from './dtos/upload-request.dto';
import { MakeUploadEntryCommand } from './usecases/make-upload-entry/make-upload-entry.command';
import { MakeUploadEntry, PaginateFileContent, GetUploadProcessInformation, GetOriginalFileContent } from './usecases';

@Controller('/upload')
@ApiTags('Uploads')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private makeUploadEntry: MakeUploadEntry,
    private getUpload: GetUpload,
    private getOriginalFileContent: GetOriginalFileContent,
    private getUploadProcessInfo: GetUploadProcessInformation,
    private paginateFileContent: PaginateFileContent
  ) {}

  @Post(':templateId')
  @ApiOperation({
    summary: `Upload file to template`,
  })
  @ApiParam({
    name: 'templateId',
    required: true,
    description: 'ID of the template',
    type: 'string',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile('file', ValidImportFile) file: Express.Multer.File,
    @Body() body: UploadRequestDto,
    @Param('templateId', ValidateTemplate) templateId: string
  ) {
    return this.makeUploadEntry.execute(
      MakeUploadEntryCommand.create({
        file: file,
        templateId,
        extra: body.extra,
        authHeaderValue: body.authHeaderValue,
        schema: body.schema,
      })
    );
  }

  @Get(':uploadId')
  @ApiOperation({
    summary: 'Get Upload information',
  })
  getUploadInformation(@Param('uploadId', ValidateMongoId) uploadId: string) {
    return this.getUpload.execute(GetUploadCommand.create({ uploadId }));
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

  @Get(':uploadId/files/original')
  @ApiOperation({
    summary: 'Get original uploaded file',
  })
  @ApiOkResponse({
    description: 'Returns original uploaded file',
  })
  async getOriginalFile(@Param('uploadId', ValidateMongoId) uploadId: string, @Res() res: Response) {
    const { name, content, type } = await this.getOriginalFileContent.execute(uploadId);

    res.setHeader('Content-Type', type);
    res.setHeader('Content-Disposition', 'attachment; filename=' + name);
    res.send(content);
  }

  @Get(':uploadId/rows/valid')
  @ApiOperation({
    summary: 'Get valid rows of the uploaded file',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page index of data to return',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Size of data to return',
  })
  @ApiOkResponse({
    description: 'Returns paginated data',
    type: PaginationResponseDto,
  })
  async getValidRows(
    @Param('uploadId', ValidateMongoId) uploadId: string,
    @Query('page') page = Defaults.ONE,
    @Query('limit') limit = Defaults.PAGE_LIMIT
  ): Promise<PaginationResponseDto> {
    const uploadData = await this.getUploadProcessInfo.execute(uploadId);

    // throw error if upload information not found
    validateNotFound(uploadData, 'upload');

    // Rows can only be retrieved after the upload is completed
    validateUploadStatus(uploadData.status as UploadStatusEnum, [
      UploadStatusEnum.CONFIRMED,
      UploadStatusEnum.PROCESSING,
      UploadStatusEnum.COMPLETED,
    ]);

    if (!uploadData._validDataFileId) {
      return {
        data: [],
        page: 0,
        limit: 0,
        totalPages: 0,
        totalRecords: 0,
      };
    }

    const validDataPath = (uploadData._validDataFileId as unknown as FileEntity).path;

    return this.paginateFileContent.execute(validDataPath, page, limit);
  }

  @Get(':uploadId/rows/invalid')
  @ApiOperation({
    summary: 'Get invalid rows of the uploaded file',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page index of data to return',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Size of data to return',
  })
  @ApiOkResponse({
    description: 'Returns paginated data',
    type: PaginationResponseDto,
  })
  async getInvalidRows(
    @Param('uploadId', ValidateMongoId) uploadId: string,
    @Query('page') page = Defaults.ONE,
    @Query('limit') limit = Defaults.PAGE_LIMIT
  ): Promise<PaginationResponseDto> {
    const uploadData = await this.getUploadProcessInfo.execute(uploadId);

    // throw error if upload information not found
    validateNotFound(uploadData, 'upload');

    // Rows can only be retrieved after the upload is completed
    validateUploadStatus(uploadData.status as UploadStatusEnum, [
      UploadStatusEnum.CONFIRMED,
      UploadStatusEnum.PROCESSING,
      UploadStatusEnum.COMPLETED,
    ]);

    if (!uploadData._invalidDataFileId) {
      return {
        data: [],
        page: 0,
        limit: 0,
        totalPages: 0,
        totalRecords: 0,
      };
    }
    const invalidDataPath = (uploadData._invalidDataFileId as unknown as FileEntity).path;

    return this.paginateFileContent.execute(invalidDataPath, page, limit);
  }
}
