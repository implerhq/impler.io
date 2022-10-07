import { Module } from '@nestjs/common';
import { ColumnRepository, DalService, ProjectRepository, TemplateRepository } from '@impler/dal';
import { S3StorageService, StorageService } from './storage/storage.service';
import { CSVFileService } from './file/file.service';
import { FileNameService } from './file/name.service';

const DAL_MODELS = [ProjectRepository, TemplateRepository, ColumnRepository];
const FILE_SERVICES = [CSVFileService, FileNameService];

const dalService = new DalService();

function getStorageServiceClass() {
  return S3StorageService;
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
  ...FILE_SERVICES,
];

@Module({
  imports: [],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
