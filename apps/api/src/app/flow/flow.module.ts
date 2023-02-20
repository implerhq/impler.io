import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { SharedModule } from '@shared/shared.module';
import { FlowController } from './flow.controller';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [FlowController],
})
export class FlowModule {}
