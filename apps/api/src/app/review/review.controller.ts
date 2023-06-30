import { Response } from 'express';
import { ApiOperation, ApiTags, ApiSecurity, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';

import { APIMessages } from '@shared/constants';
import { FileEntity, UploadEntity } from '@impler/dal';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { validateUploadStatus } from '@shared/helpers/upload.helpers';
import { Defaults, ACCESS_KEY_NAME, UploadStatusEnum } from '@impler/shared';

import {
  DoReview,
  GetUpload,
  StartProcess,
  UpdateImportCount,
  GetFileInvalidData,
  ReanameFileHeadings,
  StartProcessCommand,
  GetUploadInvalidData,
  UpdateImportCountCommand,
} from './usecases';

import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { ConfirmReviewRequestDto } from './dtos/confirm-review-request.dto';
import { GetUploadCommand } from '@shared/usecases/get-upload/get-upload.command';
import { paginateRecords, validateNotFound } from '@shared/helpers/common.helper';
import { PaginationResponseDto } from '@shared/dtos/pagination-response.dto';

@Controller('/review')
@ApiTags('Review')
@ApiSecurity(ACCESS_KEY_NAME)
export class ReviewController {
  constructor(
    private doReview: DoReview,
    private getUpload: GetUpload,
    private startProcess: StartProcess,
    private updateImportCount: UpdateImportCount,
    private getFileInvalidData: GetFileInvalidData,
    private renameFileHeadings: ReanameFileHeadings,
    private getUploadInvalidData: GetUploadInvalidData
  ) {}

  @Get(':uploadId')
  @ApiOperation({
    summary: 'Get Review data for uploaded file',
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
    description: 'Paginated reviewed data',
    type: PaginationResponseDto,
  })
  async getReview(
    @Param('uploadId') _uploadId: string,
    @Query('page') page = Defaults.ONE,
    @Query('limit') limit = Defaults.PAGE_LIMIT,
    @Res() res: Response
  ) {
    const uploadData = await this.getUploadInvalidData.execute(_uploadId);
    if (!uploadData) throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');

    if (uploadData.status === UploadStatusEnum.MAPPED) {
      return await this.doReview.execute(_uploadId, res, limit);
    } else {
      // Uploaded file is already reviewed, return reviewed data
      const invalidData = await this.getFileInvalidData.execute(
        (uploadData._invalidDataFileId as unknown as FileEntity).path
      );
      const { data, ...rest } = paginateRecords(invalidData, page, limit);
      for (const item of data) {
        res.write(`data: ${JSON.stringify(item)}\n\n`);
      }
      res.write(`data: ${JSON.stringify(rest)}\n\n`);
      res.end();
    }
  }

  @Post(':uploadId/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Confirm review data for uploaded file',
  })
  async doConfirmReview(
    @Param('uploadId', ValidateMongoId) _uploadId: string,
    @Body() body: ConfirmReviewRequestDto
  ): Promise<UploadEntity> {
    const uploadInformation = await this.getUpload.execute(
      GetUploadCommand.create({
        uploadId: _uploadId,
        select: 'status _validDataFileId _invalidDataFileId totalRecords invalidRecords _templateId',
      })
    );

    // throw error if upload information not found
    validateNotFound(uploadInformation, 'upload');

    // upload files with status reviewing can only be confirmed
    validateUploadStatus(uploadInformation.status as UploadStatusEnum, [UploadStatusEnum.REVIEWING]);

    // rename file headings
    await this.renameFileHeadings.execute(
      _uploadId,
      uploadInformation._validDataFileId,
      uploadInformation._invalidDataFileId
    );

    await this.updateImportCount.execute(
      uploadInformation._templateId,
      UpdateImportCountCommand.create({
        totalRecords: uploadInformation.totalRecords,
        totalInvalidRecords: uploadInformation.invalidRecords,
      })
    );

    return this.startProcess.execute(
      StartProcessCommand.create({
        _uploadId: _uploadId,
        processInvalidRecords: body.processInvalidRecords,
      })
    );
  }
}
