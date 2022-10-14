import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { ReviewController } from './review.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [ReviewController],
})
export class ReviewModule {}
