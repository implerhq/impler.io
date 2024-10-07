import { Module } from '@nestjs/common';
import { USECASES } from './usecase';
import { SharedModule } from '@shared/shared.module';
import { ImportJobsController } from './import-jobs.controller';

@Module({
  imports: [SharedModule],
  providers: [...USECASES],
  controllers: [ImportJobsController],
})
export class ImportJobsModule {}
