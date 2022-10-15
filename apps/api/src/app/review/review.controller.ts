import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { DoReview } from './usecases/do-review/do-review.usecase';

@Controller('/review')
@ApiTags('Review')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class ReviewController {
  constructor(private doReview: DoReview) {}

  @Get(':uploadId')
  @ApiOperation({
    summary: 'Get Review data for uploaded file',
  })
  async getReview(@Param('uploadId') uploadId: string) {
    return await this.doReview.execute(uploadId);
  }
}
