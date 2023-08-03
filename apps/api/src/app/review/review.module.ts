import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { ReviewController } from './review.controller';
import { SharedModule } from '@shared/shared.module';
import { AJVService } from './service/AJV.service';
import { Sandbox, SManager } from './service/Sandbox';
import { QueueService } from '@shared/services/queue.service';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES, AJVService, QueueService, SManager, Sandbox],
  controllers: [ReviewController],
})
export class ReviewModule {}
