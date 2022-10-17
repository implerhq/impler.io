import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { DoReview } from './usecases/do-review/do-review.usecase';
import { SaveReviewData } from './usecases/save-review-data/save-review-data.usecase';

@Controller('/review')
@ApiTags('Review')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class ReviewController {
  constructor(private doReview: DoReview, private saveReviewData: SaveReviewData) {}

  @Get(':uploadId')
  @ApiOperation({
    summary: 'Get Review data for uploaded file',
  })
  async getReview(@Param('uploadId') _uploadId: string) {
    /*
     * send review invalid json data if status is Reviewing
     * else if status is Mapped -> do review
     */
    const reviewData = await this.doReview.execute(_uploadId);
    // save invalid data to storage
    this.saveReviewData.execute(_uploadId, reviewData.invalid, reviewData.valid);

    return reviewData.invalid;
  }
}
