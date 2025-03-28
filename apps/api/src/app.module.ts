import { DynamicModule, Logger, Module } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { SharedModule } from './app/shared/shared.module';
import { ProjectModule } from './app/project/project.module';
import { TemplateModule } from './app/template/template.module';
import { ColumnModule } from './app/column/column.module';
import { UploadModule } from './app/upload/upload.module';
import { MappingModule } from './app/mapping/mapping.module';
import { ReviewModule } from './app/review/review.module';
import { CommonModule } from './app/common/common.module';
import { HealthModule } from 'app/health/health.module';
import { AuthModule } from './app/auth/auth.module';
import { EnvironmentModule } from './app/environment/environment.module';
import { ActivityModule } from './app/activity/activity.module';
import { UserModule } from './app/user/user.module';
import { ImportJobsModule } from 'app/import-jobs/import-jobs.module';
import { TeamModule } from 'app/team/team.module';
import { AutoImportJobsSchedularModule } from 'app/auto-import-jobs-schedular/auto-import-jobs-schedular.module';
import { FailedWebhookRetryModule } from 'app/failed-webhook-request-retry/failed-webhook-retry.module';

const modules: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
  ProjectModule,
  SharedModule,
  TemplateModule,
  ColumnModule,
  UploadModule,
  MappingModule,
  ReviewModule,
  CommonModule,
  HealthModule,
  AuthModule,
  UserModule,
  EnvironmentModule,
  ActivityModule,
  ImportJobsModule,
  TeamModule,
  AutoImportJobsSchedularModule,
  FailedWebhookRetryModule,
];

const providers = [Logger];

@Module({
  imports: modules,
  controllers: [],
  providers,
})
export class AppModule {}
