import { ApiOperation, ApiTags, ApiSecurity, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { APIMessages } from '@shared/constants';
import { RecordEntity, UploadEntity } from '@impler/dal';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { validateUploadStatus } from '@shared/helpers/upload.helpers';
import { Defaults, ACCESS_KEY_NAME, UploadStatusEnum } from '@impler/shared';

import {
  DoReview,
  GetUpload,
  UpdateRecord,
  StartProcess,
  GetUploadData,
  UpdateImportCount,
  StartProcessCommand,
  UpdateImportCountCommand,
} from './usecases';

import { validateNotFound } from '@shared/helpers/common.helper';
import { ConfirmReviewRequestDto } from './dtos/confirm-review-request.dto';
import { PaginationResponseDto } from '@shared/dtos/pagination-response.dto';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { GetUploadCommand } from '@shared/usecases/get-upload/get-upload.command';

@Controller('/review')
@ApiTags('Review')
@ApiSecurity(ACCESS_KEY_NAME)
export class ReviewController {
  constructor(
    private doReview: DoReview,
    private getUpload: GetUpload,
    private startProcess: StartProcess,
    private updateRecord: UpdateRecord,
    private updateImportCount: UpdateImportCount,
    private getFileInvalidData: GetUploadData
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
    @Query('limit') limit = Defaults.PAGE_LIMIT
  ) {
    const uploadData = await this.getUpload.execute({
      uploadId: _uploadId,
    });
    if (!uploadData) throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);

    if (uploadData.status === UploadStatusEnum.MAPPED) {
      uploadData.totalRecords = await this.doReview.execute(_uploadId);
    }

    return await this.getFileInvalidData.execute(_uploadId, page, limit, uploadData.totalRecords);
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

  @Put(':uploadId/record')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update review data for ongoing import',
  })
  async updateReviewData(@Param('uploadId', ValidateMongoId) _uploadId: string, @Body() body: RecordEntity) {
    await this.updateRecord.execute(_uploadId, body);
  }
}
