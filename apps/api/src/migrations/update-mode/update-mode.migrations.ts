import '../../config';
import { AppModule } from '../../app.module';

import { NestFactory } from '@nestjs/core';
import { TemplateRepository } from '@impler/dal';

export async function run() {
  console.log('start migration - registering payment users');

  let app;
  try {
    // Initialize the MongoDB connection
    app = await NestFactory.create(AppModule, {
      logger: false,
    });

    const templateRepository = new TemplateRepository();

    // Fetch all templates without the 'mode' field
    const templatesWithoutMode = await templateRepository.find({ mode: { $exists: false } });
    console.log('Templates without mode:', templatesWithoutMode);

    const updateResult = await templateRepository.update({ mode: { $exists: false } }, { mode: 'manual', multi: true });

    console.log('Updated templates:', updateResult);

    console.log('end migration - Adding manual mode to all templates users');
  } catch (error) {
    console.error('An error occurred during the migration:', error);
  } finally {
    if (app) {
      await app.close();
    }
    process.exit(0);
  }
}

run();
