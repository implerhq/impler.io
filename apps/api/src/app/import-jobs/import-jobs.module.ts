import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { USECASES } from './usecase';
import { ImportJobsController } from './import-jobs.controller';

@Module({
  imports: [SharedModule],
  providers: [...USECASES],
  controllers: [ImportJobsController],
})
export class ImportJobsModule {}
