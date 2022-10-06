import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { ColumnController } from './column.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [ColumnController],
})
export class ColumnModule {}
