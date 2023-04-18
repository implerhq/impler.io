import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { EnvironmentController } from './environment.controller';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
