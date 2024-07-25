import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SchedulerRegistry } from '@nestjs/schedule';
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
import { CSVFileService2, ExcelFileService } from './services/file/file.service';
import { S3StorageService, StorageService, EmailService, SESEmailService, FileNameService } from '@impler/services';

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
  ...FILE_SERVICES,
  JwtService,
];

@Module({
  imports: [],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
