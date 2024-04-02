import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { TemplateController } from './template.controller';
import { SharedModule } from '@shared/shared.module';
import { Sandbox, SManager } from '../shared/services/sandbox';
import { BubbleIoService } from '@shared/services/bubble-io.service';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES, SManager, Sandbox, BubbleIoService],
  controllers: [TemplateController],
})
export class TemplateModule {}
