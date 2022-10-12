import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { OpsController } from './ops.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [OpsController],
})
export class OpsModule {}
