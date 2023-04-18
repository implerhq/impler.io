import { forwardRef, Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { AuthModule } from 'app/auth/auth.module';
import { SharedModule } from '@shared/shared.module';
import { ProjectController } from './project.controller';
import { UniqueValidator } from '@shared/framework/is-unique.validator';
import { EnvironmentModule } from 'app/environment/environment.module';

@Module({
  imports: [SharedModule, UniqueValidator, forwardRef(() => AuthModule), EnvironmentModule],
  providers: [...USE_CASES],
  controllers: [ProjectController],
})
export class ProjectModule {}
