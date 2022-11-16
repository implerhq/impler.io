import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { UploadController } from './upload.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [UploadController],
})
export class UploadModule {}
