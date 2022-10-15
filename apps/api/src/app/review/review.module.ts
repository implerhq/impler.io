import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { ReviewController } from './review.controller';
import { SharedModule } from '../shared/shared.module';
import { AJVService } from './service/AJV.service';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES, AJVService],
  controllers: [ReviewController],
})
export class ReviewModule {}
