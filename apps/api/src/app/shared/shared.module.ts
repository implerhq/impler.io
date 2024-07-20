import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ColumnRepository,
  CommonRepository,
  DalService,
  FileRepository,
  MappingRepository,
  ProjectRepository,
  TemplateRepository,
  UploadRepository,
  UserRepository,
  EnvironmentRepository,
  CustomizationRepository,
  ValidatorRepository,
  WebhookDestinationRepository,
  BubbleDestinationRepository,
  UserJobRepository,
  JobMappingRepository,
} from '@impler/dal';
import { FileNameService } from '@impler/shared';
import { SchedulerRegistry } from '@nestjs/schedule';
import { S3StorageService, StorageService } from '@impler/shared/dist/services/storage';
import { CSVFileService2, ExcelFileService } from './services/file/file.service';
import { EmailService, SESEmailService } from './services/email.service';
import { CronJobService } from '@shared/services/cronjob.service';
import { QueueService } from './services/queue.service';
import { RSSService } from './services/rss.service';

const DAL_MODELS = [
  ProjectRepository,
  TemplateRepository,
  ColumnRepository,
  FileRepository,
  UploadRepository,
  MappingRepository,
  CommonRepository,
  UserRepository,
  EnvironmentRepository,
  CustomizationRepository,
  ValidatorRepository,
  WebhookDestinationRepository,
  BubbleDestinationRepository,
  UserJobRepository,
  JobMappingRepository,
  UserJobRepository,
  SchedulerRegistry,
];
const FILE_SERVICES = [CSVFileService2, FileNameService, ExcelFileService];

const dalService = new DalService();

function getStorageServiceClass() {
  return S3StorageService;
}

function getEmailServiceClass() {
  return SESEmailService;
}

function getQueueServiceClass() {
  return QueueService;
}

function getRSSServiceClass() {
  return RSSService;
}
function getCronJobService() {
  return CronJobService;
}

const PROVIDERS = [
  {
    provide: DalService,
    useFactory: async () => {
      await dalService.connect(process.env.MONGO_URL);

      return dalService;
    },
  },
  ...DAL_MODELS,
  {
    provide: StorageService,
    useClass: getStorageServiceClass(),
  },
  {
    provide: EmailService,
    useClass: getEmailServiceClass(),
  },
  {
    provide: QueueService,
    useClass: getQueueServiceClass(),
  },
  {
    provide: RSSService,
    useClass: getRSSServiceClass(),
  },
  {
    provide: CronJobService,
    useClass: getCronJobService(),
  },
  ...FILE_SERVICES,
  JwtService,
];

@Module({
  imports: [],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
