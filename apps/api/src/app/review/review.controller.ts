import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { FileEntity } from '@impler/dal';
import { UploadStatusEnum } from '@impler/shared';
import { APIMessages } from '../shared/constants';
import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { validateUploadStatus } from '../shared/helpers/upload.helpers';
import { DoReview } from './usecases/do-review/do-review.usecase';
import { GetUploadInvalidData } from './usecases/get-upload-invalid-data/get-upload-invalid-data.usecase';
import { SaveReviewData } from './usecases/save-review-data/save-review-data.usecase';
import { GetFileInvalidData } from './usecases/get-file-invalid-data/get-file-invalid-data.usecase';

@Controller('/review')
@ApiTags('Review')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class ReviewController {
  constructor(
    private doReview: DoReview,
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
}
