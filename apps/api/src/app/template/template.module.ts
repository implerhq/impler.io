import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { TemplateController } from './template.controller';
import { SharedModule } from '@shared/shared.module';
import { Sandbox, SManager } from '../shared/services/sandbox';
import { BubbleIoService } from '@shared/services/bubble-io.service';
import { PaymentAPIService } from '@impler/services';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES, SManager, Sandbox, BubbleIoService, PaymentAPIService],
  controllers: [TemplateController],
})
export class TemplateModule {}
