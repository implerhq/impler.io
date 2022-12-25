import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { CommonController } from './common.controller';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [CommonController],
})
export class CommonModule {}
