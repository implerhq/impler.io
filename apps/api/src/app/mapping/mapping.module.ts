import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { GetUpload } from './../upload/usecases/get-upload/get-upload.usecase';
import { MappingController } from './mapping.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES, GetUpload],
  controllers: [MappingController],
})
export class MappingModule {}
