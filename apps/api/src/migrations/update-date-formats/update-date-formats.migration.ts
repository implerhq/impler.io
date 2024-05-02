import '../../config';
import { AppModule } from '../../app.module';

import { NestFactory } from '@nestjs/core';
import { ColumnRepository } from '@impler/dal';

function checkFirstLetterLowerCase(_string) {
  return /[a-z]/.test(_string[0]);
}

export async function run() {
  // eslint-disable-next-line no-console
  console.log('start migration - convert date formats to uppercase');

  // Init the mongodb connection
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const columnRepository = new ColumnRepository();
  const columns = await columnRepository.find(
    {
      $and: [
        {
          dateFormats: {
            $ne: [],
          },
        },
        {
          dateFormats: {
            $exists: true,
          },
        },
      ],
    },
    'dateFormats'
  );

  const columnsWithLowerCaseFormat = columns.filter((column) => checkFirstLetterLowerCase(column.dateFormats[0]));

  if (columnsWithLowerCaseFormat.length > 0) {
    for (const column of columnsWithLowerCaseFormat) {
      column.dateFormats = column.dateFormats.map((format) => format.toUpperCase());
      await columnRepository.update({ _id: column._id }, { dateFormats: column.dateFormats });
    }

    // eslint-disable-next-line no-console
    console.log(`Converted ${columnsWithLowerCaseFormat.length} columns date formats to uppercase`);
  }

  // eslint-disable-next-line no-console
  console.log('end migration - convert date formats to uppercase');

  app.close();
  process.exit(0);
}
run();
