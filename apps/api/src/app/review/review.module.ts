import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { ReviewController } from './review.controller';
import { SharedModule } from '@shared/shared.module';
import { AJVService } from './service/AJV.service';
import { Sandbox, SManager } from '../shared/services/sandbox';
import { QueueService } from '@shared/services/queue.service';
import { GetTemplateDetails } from 'app/template/usecases';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES, AJVService, QueueService, SManager, Sandbox, GetTemplateDetails],
  controllers: [ReviewController],
})
export class ReviewModule {}
