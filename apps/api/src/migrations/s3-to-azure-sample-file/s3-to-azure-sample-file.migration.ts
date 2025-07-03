/* eslint-disable multiline-comment-style */
import '../../config';
import { AppModule } from '../../app.module';

import { NestFactory } from '@nestjs/core';
import { ExcelFileService } from '@shared/services';
import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { AzureStorageService, FileNameService } from '@impler/services';
import { ColumnTypesEnum, FileMimeTypesEnum, ColumnDelimiterEnum } from '@impler/shared';
import { IExcelFileHeading } from '@shared/types/file.types';

export async function run() {
  let app;

  try {
    console.log('start migration - regenerating sample excel files for all templates');

    app = await NestFactory.create(AppModule, {
      logger: false,
    });

    // Create services manually (since DI is not working for these services)
    const templateRepository = new TemplateRepository();
    const columnRepository = new ColumnRepository();
    const excelFileService = new ExcelFileService();
    const storageService = new AzureStorageService();
    const fileNameService = new FileNameService();

    // Check if Azure connection string is available
    const azureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    let azureStorageService = null;

    if (azureConnectionString) {
      try {
        azureStorageService = new AzureStorageService();
      } catch (error) {}
    }

    const templates = await templateRepository.find(
      {
        sampleFileUrl: {
          $exists: true,
          $nin: ['', null],
        },
      },
      'sampleFileUrl name'
    );

    if (templates.length === 0) {
      return;
    }

    const templateIds = templates.map((template) => template._id);

    const columns = await columnRepository.find({
      _templateId: {
        $in: templateIds,
      },
    });

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      try {
        const templateColumns = columns.filter((column) => column._templateId.toString() === template._id.toString());

        if (templateColumns.length > 0) {
          const columnKeys: IExcelFileHeading[] = templateColumns
            .map((columnItem) => ({
              key: columnItem.key,
              type: columnItem.type as ColumnTypesEnum,
              selectValues: columnItem.selectValues,
              isFrozen: columnItem.isFrozen,
              delimiter: columnItem.delimiter || ColumnDelimiterEnum.COMMA,
              isRequired: columnItem.isRequired,
              dateFormats: columnItem.dateFormats,
              allowMultiSelect: columnItem.allowMultiSelect,
              description: columnItem.description,
            }))
            .sort((a, b) => (a.isFrozen === b.isFrozen ? 0 : a.isFrozen ? -1 : 1));

          const hasMultiSelect = templateColumns.some(
            (columnItem) => columnItem.type === ColumnTypesEnum.SELECT && columnItem.allowMultiSelect
          );

          const fileName = fileNameService.getSampleFileName(template._id, hasMultiSelect);
          const sampleFileUrl = fileNameService.getSampleFileUrl(template._id, hasMultiSelect);

          const sampleExcelFile = await excelFileService.getExcelFileForHeadings(columnKeys);

          await storageService.uploadFile(fileName, sampleExcelFile, FileMimeTypesEnum.EXCELM);

          await templateRepository.update({ _id: template._id }, { sampleFileUrl });

          if (azureStorageService) {
            try {
              await azureStorageService.uploadFile(template.sampleFileUrl, sampleExcelFile, template._id);
            } catch (error) {}
          }
        }
      } catch (error) {
        continue;
      }
    }

    console.log('end migration - regenerating sample excel files for all templates');
  } catch (error) {
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

run()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
