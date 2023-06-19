import { Module } from '@nestjs/common';
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
} from '@impler/dal';
import { S3StorageService, StorageService } from '@impler/shared/dist/services/storage';
import { CSVFileService, ExcelFileService } from './services/file/file.service';
import { EmailService, SESEmailService } from './services/email.service';
import { FileNameService } from './services/file/name.service';

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
];
const FILE_SERVICES = [CSVFileService, FileNameService, ExcelFileService];

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
];

@Module({
  imports: [],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
