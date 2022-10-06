import { Module } from '@nestjs/common';
import { ColumnRepository, DalService, ProjectRepository, TemplateRepository } from '@impler/dal';

const DAL_MODELS = [ProjectRepository, TemplateRepository, ColumnRepository];

const dalService = new DalService();

const PROVIDERS = [
  {
    provide: DalService,
    useFactory: async () => {
      await dalService.connect(process.env.MONGO_URL);

      return dalService;
    },
  },
  ...DAL_MODELS,
];

@Module({
  imports: [],
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
