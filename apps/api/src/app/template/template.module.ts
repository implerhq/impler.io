import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { TemplateController } from './template.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [TemplateController],
})
export class TemplateModule {}
