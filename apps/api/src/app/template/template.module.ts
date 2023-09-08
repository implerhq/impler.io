import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { TemplateController } from './template.controller';
import { SharedModule } from '@shared/shared.module';
import { Sandbox, SManager } from '../shared/services/sandbox';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES, SManager, Sandbox],
  controllers: [TemplateController],
})
export class TemplateModule {}
