import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { FileEntity, UploadEntity } from '@impler/dal';
import { QueuesEnum, UploadStatusEnum } from '@impler/shared';
import { APIMessages } from '../shared/constants';
import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { validateUploadStatus } from '../shared/helpers/upload.helpers';
import { DoReview } from './usecases/do-review/do-review.usecase';
import { GetUploadInvalidData } from './usecases/get-upload-invalid-data/get-upload-invalid-data.usecase';
import { SaveReviewData } from './usecases/save-review-data/save-review-data.usecase';
import { GetFileInvalidData } from './usecases/get-file-invalid-data/get-file-invalid-data.usecase';
import { ValidateMongoId } from '../shared/validations/valid-mongo-id.validation';
import { ConfirmReviewRequestDto } from './dtos/confirm-review-request.dto';
import { GetUploadCommand } from '../shared/usecases/get-upload/get-upload.command';
import { GetUpload } from '../shared/usecases/get-upload/get-upload.usecase';
import { validateNotFound } from '../shared/helpers/common.helper';
import { ConfirmReview } from './usecases/confirm-review/confirm-review.usecase';
import { ConfirmReviewCommand } from './usecases/confirm-review/confirm-review.command';
import { QueueService } from '../shared/storage/queue.service';

@Controller('/review')
@ApiTags('Review')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class ReviewController {
  constructor(
    private doReview: DoReview,
    private getUpload: GetUpload,
    private queueService: QueueService,
    private confirmReview: ConfirmReview,
    private saveReviewData: SaveReviewData,
    private getFileInvalidData: GetFileInvalidData,
    private getUploadInvalidData: GetUploadInvalidData
  ) {}

  @Get(':uploadId')
  @ApiOperation({
    summary: 'Get Review data for uploaded file',
  })
  async getReview(@Param('uploadId') _uploadId: string) {
    const uploadData = await this.getUploadInvalidData.execute(_uploadId);
    if (!uploadData) throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);

    // Only Mapped & Reviewing status are allowed
    validateUploadStatus(uploadData.status as UploadStatusEnum, [UploadStatusEnum.MAPPED, UploadStatusEnum.REVIEWING]);

    if (uploadData.status === UploadStatusEnum.MAPPED) {
      // uploaded file is mapped, do review
      const reviewData = await this.doReview.execute(_uploadId);
      // save invalid data to storage
      this.saveReviewData.execute(_uploadId, reviewData.invalid, reviewData.valid);

      return reviewData.invalid;
    } else {
      // Uploaded file is already reviewed, return reviewed data
      return this.getFileInvalidData.execute((uploadData._invalidDataFileId as unknown as FileEntity).path);
    }
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

    return this.confirmReview.execute(
      ConfirmReviewCommand.create({
        _uploadId: _uploadId,
        processInvalidRecords: body.processInvalidRecords,
      })
    );
  }

  @Post(':uploadId/process')
  @ApiOperation({
    summary: 'Start processing for uploaded files',
  })
  processUpload(@Param('uploadId', ValidateMongoId) _uploadId: string) {
    this.queueService.publishToQueue(QueuesEnum.PROCESS_FILE, { uploadId: _uploadId });

    return 'send';
  }
}
