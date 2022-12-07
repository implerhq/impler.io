import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiSecurity, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { FileEntity, UploadEntity } from '@impler/dal';
import { ACCESS_KEY_NAME, UploadStatusEnum } from '@impler/shared';
import { APIMessages } from '@shared/constants';
import { APIKeyGuard } from '@shared/framework/auth.gaurd';
import { validateUploadStatus } from '@shared/helpers/upload.helpers';
import { DoReview } from './usecases/do-review/do-review.usecase';
import { GetUploadInvalidData } from './usecases/get-upload-invalid-data/get-upload-invalid-data.usecase';
import { SaveReviewData } from './usecases/save-review-data/save-review-data.usecase';
import { GetFileInvalidData } from './usecases/get-file-invalid-data/get-file-invalid-data.usecase';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { ConfirmReviewRequestDto } from './dtos/confirm-review-request.dto';
import { GetUploadCommand } from '@shared/usecases/get-upload/get-upload.command';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';
import { paginateRecords, validateNotFound } from '@shared/helpers/common.helper';
import { StartProcess } from './usecases/start-process/start-process.usecase';
import { StartProcessCommand } from './usecases/start-process/start-process.command';
import { PaginationResponseDto } from '@shared/dtos/pagination-response.dto';
import { Defaults } from '@impler/shared';

@Controller('/review')
@ApiTags('Review')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(APIKeyGuard)
export class ReviewController {
  constructor(
    private doReview: DoReview,
    private getUpload: GetUpload,
    private startProcess: StartProcess,
    private saveReviewData: SaveReviewData,
    private getFileInvalidData: GetFileInvalidData,
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
    @Query('page') page = Defaults.PAGE,
    @Query('limit') limit = Defaults.PAGE_LIMIT
  ): Promise<PaginationResponseDto> {
    const uploadData = await this.getUploadInvalidData.execute(_uploadId);
    if (!uploadData) throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);

    // Only Mapped & Reviewing status are allowed
    validateUploadStatus(uploadData.status as UploadStatusEnum, [UploadStatusEnum.MAPPED, UploadStatusEnum.REVIEWING]);

    // Get Invalid Data either from Validation or Validation Result
    let invalidData = [];
    if (uploadData.status === UploadStatusEnum.MAPPED) {
      // uploaded file is mapped, do review
      const reviewData = await this.doReview.execute(_uploadId);
      // save invalid data to storage
      await this.saveReviewData.execute(_uploadId, reviewData.invalid, reviewData.valid);

      invalidData = reviewData.invalid;
    } else {
      // Uploaded file is already reviewed, return reviewed data
      invalidData = await this.getFileInvalidData.execute(
        (uploadData._invalidDataFileId as unknown as FileEntity).path
      );
    }

    return paginateRecords(invalidData, page, limit);
  }

  @Post(':uploadId/confirm')
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
        select: 'status',
      })
    );

    // throw error if upload information not found
    validateNotFound(uploadInformation, 'upload');

    // upload files with status reviewing can only be confirmed
    validateUploadStatus(uploadInformation.status as UploadStatusEnum, [UploadStatusEnum.REVIEWING]);

    return this.startProcess.execute(
      StartProcessCommand.create({
        _uploadId: _uploadId,
        processInvalidRecords: body.processInvalidRecords,
      })
    );
  }
}
