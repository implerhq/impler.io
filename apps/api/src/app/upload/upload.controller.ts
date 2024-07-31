// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import _whatever from 'multer';
import { Response } from 'express';
import { FileEntity } from '@impler/dal';
import { FileInterceptor } from '@nestjs/platform-express';
import { ACCESS_KEY_NAME, Defaults, UploadStatusEnum } from '@impler/shared';
import {
  Body,
  Controller,
  Delete,
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

import { GetUpload, GetAsset } from './usecases';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { getAssetMimeType, validateNotFound } from '@shared/helpers/common.helper';
import { validateUploadStatus } from '@shared/helpers/upload.helpers';
import { PaginationResponseDto } from '@shared/dtos/pagination-response.dto';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { ValidateTemplate } from '@shared/validations/valid-template.validation';
import { ValidImportFile } from '@shared/validations/valid-import-file.validation';

import { UploadRequestDto } from './dtos/upload-request.dto';
import {
  TerminateUpload,
  MakeUploadEntry,
  GetUploadColumns,
  PaginateFileContent,
  GetUploadProcessInformation,
  GetOriginalFileContent,
} from './usecases';

@ApiTags('Uploads')
@Controller('/upload')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private getAsset: GetAsset,
    private getUpload: GetUpload,
    private terminateUpload: TerminateUpload,
    private makeUploadEntry: MakeUploadEntry,
    private getUploadColumns: GetUploadColumns,
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
    @Body() body: UploadRequestDto,
    @Param('templateId', ValidateTemplate) templateId: string,
    @UploadedFile('file', ValidImportFile) file: Express.Multer.File
  ) {
    return this.makeUploadEntry.execute({
      file: file,
      templateId,
      extra: body.extra,
      schema: body.schema,
      output: body.output,
      importId: body.importId,
      imageSchema: body.imageSchema,

      authHeaderValue: body.authHeaderValue,
      selectedSheetName: body.selectedSheetName,
    });
  }

  @Get(':uploadId')
  @ApiOperation({
    summary: 'Get Upload information',
  })
  getUploadInformation(@Param('uploadId', ValidateMongoId) uploadId: string) {
    return this.getUpload.execute({ uploadId });
  }

  @Get(':uploadId/headings')
  @ApiOperation({
    summary: 'Get headings for the uploaded file',
  })
  async getHeadings(@Param('uploadId', ValidateMongoId) uploadId: string): Promise<string[]> {
    const uploadInfo = await this.getUpload.execute({
      uploadId,
      select: 'headings',
    });

    return uploadInfo.headings;
  }

  @Delete(':uploadId')
  @ApiOperation({
    summary: 'Terminate upload',
  })
  async terminate(@Param('uploadId', ValidateMongoId) uploadId: string) {
    return this.terminateUpload.execute(uploadId);
  }

  @Get(':uploadId/columns')
  @ApiOperation({
    summary: 'Get upload columns',
  })
  async getColumns(@Param('uploadId', ValidateMongoId) uploadId: string) {
    return this.getUploadColumns.execute(uploadId);
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
    content.pipe(res);
  }

  @Get(':uploadId/asset/:name')
  @ApiOperation({
    summary: 'Get uploaded asset file',
  })
  async getUploadedAsset(
    @Param('uploadId', ValidateMongoId) uploadId: string,
    @Param('name') assetName: string,
    @Res() res: Response
  ) {
    const content = await this.getAsset.execute(uploadId, assetName);
    res.setHeader('Content-Type', getAssetMimeType(assetName));
    res.setHeader('Content-Disposition', 'attachment; filename=' + assetName);
    content.pipe(res);
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
