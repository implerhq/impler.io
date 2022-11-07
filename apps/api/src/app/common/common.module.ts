import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [CommonController],
})
export class CommonModule {}
