import '../../config';
import { AppModule } from '../../app.module';

import { NestFactory } from '@nestjs/core';
import { SaveSampleFile } from '@shared/usecases';
import { ExcelFileService } from '@shared/services';
import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { S3StorageService, FileNameService } from '@impler/services';

export async function run() {
  // eslint-disable-next-line no-console
  console.log('start migration - regenerating sample excel files for all templates');

  // Init the mongodb connection
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const templateRepository = new TemplateRepository();
  const templates = await templateRepository.find(
    {
      $and: [
        {
          sampleFileUrl: {
            $ne: '',
          },
        },
        {
          sampleFileUrl: {
            $exists: true,
          },
        },
      ],
    },
    'sampleFileUrl name'
  );
  const templateIds = templates.map((template) => template._id);

  const columnRepository = new ColumnRepository();
  const columns = await columnRepository.find({
    _templateId: {
      $in: templateIds,
    },
  });
  const excelFileService = new ExcelFileService();

  const saveSampleFile = new SaveSampleFile(
    excelFileService,
    new S3StorageService(),
    new FileNameService(),
    templateRepository
  );

  if (columns.length > 0) {
    // eslint-disable-next-line no-console
    for (const template of templates) {
      const templateColumns = columns.filter((column) => column._templateId === template._id);

      await saveSampleFile.execute(templateColumns, template._id);
    }
  }

  // eslint-disable-next-line no-console
  console.log('end migration - regenerating sample excel files for all templates');

  app.close();
  process.exit(0);
}
run();
