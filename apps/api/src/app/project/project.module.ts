import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { SharedModule } from '../shared/shared.module';
import { ProjectController } from './project.controller';
import { UniqueValidator } from '../shared/framework/IsUniqueValidator';

@Module({
  imports: [SharedModule, UniqueValidator],
  providers: [...USE_CASES],
  controllers: [ProjectController],
})
export class ProjectModule {}
