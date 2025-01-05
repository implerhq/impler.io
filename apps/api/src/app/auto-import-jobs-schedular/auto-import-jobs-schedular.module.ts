import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { ScheduleModule } from '@nestjs/schedule';
import { USE_CASES } from './usecase';

@Module({
  imports: [ScheduleModule.forRoot(), SharedModule],
  providers: [...USE_CASES],
})
export class AutoImportJobsSchedularModule {}
