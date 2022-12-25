import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { MappingController } from './mapping.controller';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [MappingController],
})
export class MappingModule {}
