/**
 * Migration Script:
 * - Finds uploads stuck in 'PROCESSING' status
 * - Republishes them to the END_IMPORT queue to restart processing
 */

import '../../config';
import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';
import { UploadStatusEnum, QueuesEnum } from '@impler/shared';
import { UploadRepository, TemplateRepository } from '@impler/dal';
import { QueueService } from '@shared/services/queue.service';

async function run() {
  console.log('Starting migration: reprocessing uploads in PROCESSING state');

  const app = await NestFactory.create(AppModule, { logger: false });

  try {
    const uploadRepository = app.get(UploadRepository);
    const templateRepository = app.get(TemplateRepository);
    const queueService = app.get(QueueService);

    const processingUploads = await uploadRepository.find({
      status: UploadStatusEnum.PROCESSING,
    });

    if (!processingUploads.length) {
      console.log('No uploads found in PROCESSING state.');

      return;
    }

    console.log(`Found ${processingUploads.length} uploads. Republishing to queue.`);

    for (const upload of processingUploads) {
      const template = await templateRepository.findOne({ _id: upload._templateId });

      if (template?.destination) {
        queueService.publishToQueue(QueuesEnum.END_IMPORT, {
          uploadId: upload._id,
          uploadedFileId: upload._uploadedFileId,
          destination: template.destination,
        });

        console.log(`Send upload ${upload._id} to destination ${template.destination}`);
      } else {
        console.warn(`No destination found for upload ${upload._id}`);
      }
    }

    console.log('Migration completed.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

run();
