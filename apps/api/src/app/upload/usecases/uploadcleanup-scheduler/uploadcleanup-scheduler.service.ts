import * as dayjs from 'dayjs';
import { FileRepository, Upload } from '@impler/dal';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DalService } from '@impler/dal';
import { StorageService } from '@impler/services';
import { CRON_SCHEDULE } from '@shared/constants';

@Injectable()
export class UploadCleanupSchedulerService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly dalService: DalService,
    private storageService: StorageService
  ) {}

  @Cron(CRON_SCHEDULE.UPLOAD_CLEANUP_DEFAULT_CRON_TIME)
  async handleCleanupCronSchedular(cleanupDays: number = CRON_SCHEDULE.UPLOAD_CLEANUP_DAYS) {
    const cleanupDaysAgo = dayjs().subtract(cleanupDays, 'day').toDate();

    const uploads = await Upload.find({
      uploadedDate: { $lt: cleanupDaysAgo },
      _uploadedFileId: { $exists: true, $ne: '' },
    });

    if (uploads.length === 0) {
      return;
    }

    for (const upload of uploads) {
      try {
        const files = await this.fileRepository.find({ _id: upload._uploadedFileId });

        await Promise.allSettled(
          files.map(async (file) => {
            try {
              await Upload.updateOne({ _uploadedFileId: file._id }, { $set: { _uploadedFileId: '' } });

              // Delete file from storage and db
              try {
                await this.storageService.deleteFolder(file.path);
                await this.fileRepository.delete({ _id: file._id });
              } catch (error) {}

              const collectionName = `${upload._id}-records`;
              try {
                const collections = await this.dalService.connection.db
                  .listCollections({ name: collectionName })
                  .toArray();

                if (collections.length > 0) {
                  const collection = this.dalService.connection.collection(collectionName);
                  await collection.drop();
                }
              } catch (error) {}
            } catch (error) {}
          })
        );
      } catch (error) {}
    }
  }
}
