import { ApiOperation, ApiTags, ApiSecurity, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { APIMessages } from '@shared/constants';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { validateUploadStatus } from '@shared/helpers/upload.helpers';
import { Defaults, ACCESS_KEY_NAME, UploadStatusEnum, ReviewDataTypesEnum } from '@impler/shared';

import {
  Replace,
  DoReview,
  GetUpload,
  DoReReview,
  UpdateRecord,
  StartProcess,
  DeleteRecord,
  GetUploadData,
  UpdateRecords,
} from './usecases';

import { validateNotFound } from '@shared/helpers/common.helper';
import { DeleteRecordsDto, UpdateRecordDto, ReplaceDto } from './dtos';
import { PaginationResponseDto } from '@shared/dtos/pagination-response.dto';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

@Controller('/review')
@ApiTags('Review')
@ApiSecurity(ACCESS_KEY_NAME)
export class ReviewController {
  constructor(
    private replace: Replace,
    private doReview: DoReview,
    private getUpload: GetUpload,
    private doReReview: DoReReview,
    private deleteRecord: DeleteRecord,
    private startProcess: StartProcess,
    private updateRecord: UpdateRecord,
    private updateRecords: UpdateRecords,
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
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    enum: ReviewDataTypesEnum,
    description: 'Type of data filter to apply',
  })
  @ApiOkResponse({
    description: 'Paginated reviewed data',
    type: PaginationResponseDto,
  })
  async getReview(
    @Param('uploadId') _uploadId: string,
    @Query('page') page = Defaults.ONE,
    @Query('limit') limit = Defaults.PAGE_LIMIT,
    @Query('type') type = ReviewDataTypesEnum.ALL
  ) {
    const uploadData = await this.getUpload.execute({
      uploadId: _uploadId,
    });
    if (!uploadData) throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);

    return await this.getFileInvalidData.execute(
      _uploadId,
      Number(page),
      limit,
      type === ReviewDataTypesEnum.VALID
        ? uploadData.validRecords
        : type === ReviewDataTypesEnum.INVALID
        ? uploadData.invalidRecords
        : uploadData.totalRecords,
      type
    );
  }

  @Post(':uploadId')
  @ApiOperation({
    summary: 'Review Data',
  })
  async doReviewData(@Param('uploadId', ValidateMongoId) _uploadId: string) {
    const uploadData = await this.getUpload.execute({
      uploadId: _uploadId,
    });
    if (!uploadData) throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);

    if (uploadData.status === UploadStatusEnum.MAPPED) {
      await this.doReview.execute(_uploadId);
    } else if (uploadData.status === UploadStatusEnum.REVIEWING) {
      await this.doReReview.execute(_uploadId);
    }
  }

  @Post(':uploadId/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Confirm review data for uploaded file',
  })
  async doConfirmReview(@Param('uploadId', ValidateMongoId) _uploadId: string) {
    const uploadInformation = await this.getUpload.execute({
      uploadId: _uploadId,
      select: 'status _validDataFileId _invalidDataFileId totalRecords invalidRecords _templateId',
    });

    // throw error if upload information not found
    validateNotFound(uploadInformation, 'upload');

    // upload files with status reviewing can only be confirmed
    validateUploadStatus(uploadInformation.status as UploadStatusEnum, [UploadStatusEnum.REVIEWING]);

    return this.startProcess.execute(_uploadId);
  }

  @Put(':uploadId/record')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update review record for ongoing import',
  })
  async updateReviewData(@Param('uploadId') _uploadId: string, @Body() body: UpdateRecordDto) {
    return this.updateRecord.execute(_uploadId, body);
  }

  @Put(':uploadId/records')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete review records for ongoing import',
  })
  async updateRecordsRoute(
    @Param('uploadId') _uploadId: string,
    @Body(new ParseArrayPipe({ items: UpdateRecordDto })) body: UpdateRecordDto[]
  ) {
    await this.updateRecords.execute(_uploadId, body);
  }

  @Post(':uploadId/delete-records')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete review record for ongoing import',
  })
  async deleteReviewRecord(
    @Body() { indexes, valid, invalid }: DeleteRecordsDto,
    @Param('uploadId', ValidateMongoId) _uploadId: string
  ) {
    await this.deleteRecord.execute(_uploadId, indexes, valid, invalid);
  }

  @Put(':uploadId/replace')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Replace review data for ongoing import',
  })
  async replaceReviewData(@Param('uploadId', ValidateMongoId) _uploadId: string, @Body() body: ReplaceDto) {
    return await this.replace.execute(_uploadId, body);
  }
}
