import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { ProjectController } from './project.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [ProjectController],
})
export class ProjectModule {}
