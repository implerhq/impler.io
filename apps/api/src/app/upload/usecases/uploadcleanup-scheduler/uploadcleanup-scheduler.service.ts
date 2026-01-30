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
    const startTime = new Date();
    const memUsageStart = process.memoryUsage();
    const cpuUsageStart = process.cpuUsage();
    
    console.log('========================================');
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Cron Started at ${startTime.toISOString()}`);
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Cleanup days: ${cleanupDays}`);
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Memory Usage (Start): RSS=${(memUsageStart.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsageStart.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log('========================================');
    
    const cleanupDaysAgo = dayjs().subtract(cleanupDays, 'day').toDate();
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Finding uploads older than: ${cleanupDaysAgo.toISOString()}`);

    const uploads = await Upload.find({
      uploadedDate: { $lt: cleanupDaysAgo },
      _uploadedFileId: { $exists: true, $ne: '' },
    });

    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Found ${uploads.length} uploads to clean up`);

    if (uploads.length === 0) {
      console.log(`[UPLOAD-CLEANUP-SCHEDULER] No uploads to clean up, exiting`);
      return;
    }
    
    if (uploads.length > 100) {
      console.warn(`[UPLOAD-CLEANUP-SCHEDULER] ⚠️ WARNING: Processing large batch of ${uploads.length} uploads - potential CPU intensive operation`);
    }

    let uploadsProcessed = 0;
    let uploadsSucceeded = 0;
    let uploadsFailed = 0;
    let totalFilesDeleted = 0;
    let totalCollectionsDropped = 0;

    for (const upload of uploads) {
      const uploadStartTime = Date.now();
      try {
        console.log(`[UPLOAD-CLEANUP-SCHEDULER] Processing upload - ID: ${upload.id}, UploadedFileID: ${upload._uploadedFileId}`);
        
        const files = await this.fileRepository.find({ _id: upload._uploadedFileId });
        console.log(`[UPLOAD-CLEANUP-SCHEDULER] Found ${files.length} files for upload ${upload.id}`);
        
        const storagDeleteStart = Date.now();
        await this.storageService.deleteFolder(upload.id);
        const storagDeleteDuration = Date.now() - storagDeleteStart;
        console.log(`[UPLOAD-CLEANUP-SCHEDULER] Storage folder deleted - Upload: ${upload.id}, Duration: ${storagDeleteDuration}ms`);
        
        if (storagDeleteDuration > 2000) {
          console.warn(`[UPLOAD-CLEANUP-SCHEDULER] ⚠️ WARNING: Storage deletion took ${storagDeleteDuration}ms (>2s) - Upload: ${upload.id}`);
        }

        const fileResults = await Promise.allSettled(
          files.map(async (file) => {
            try {
              await Upload.updateOne({ _uploadedFileId: file._id }, { $set: { _uploadedFileId: '' } });

              // Delete file from storage and db
              try {
                await this.fileRepository.delete({ _id: file._id });
                totalFilesDeleted++;
                console.log(`[UPLOAD-CLEANUP-SCHEDULER] File deleted - FileID: ${file._id}`);
              } catch (error) {
                console.error(`[UPLOAD-CLEANUP-SCHEDULER] ❌ Error deleting file - FileID: ${file._id}`, error);
              }

              const collectionName = `${upload._id}-records`;
              try {
                const collections = await this.dalService.connection.db
                  .listCollections({ name: collectionName })
                  .toArray();

                if (collections.length > 0) {
                  const collection = this.dalService.connection.collection(collectionName);
                  await collection.drop();
                  totalCollectionsDropped++;
                  console.log(`[UPLOAD-CLEANUP-SCHEDULER] Collection dropped - Name: ${collectionName}`);
                }
              } catch (error) {
                console.error(`[UPLOAD-CLEANUP-SCHEDULER] ❌ Error dropping collection - Name: ${collectionName}`, error);
              }
            } catch (error) {
              console.error(`[UPLOAD-CLEANUP-SCHEDULER] ❌ Error processing file - FileID: ${file._id}`, error);
              throw error;
            }
          })
        );
        
        const fileSuccesses = fileResults.filter(r => r.status === 'fulfilled').length;
        const fileFailures = fileResults.filter(r => r.status === 'rejected').length;
        
        const uploadDuration = Date.now() - uploadStartTime;
        console.log(`[UPLOAD-CLEANUP-SCHEDULER] Upload processed - ID: ${upload.id}, Files: ${files.length}, Success: ${fileSuccesses}, Failed: ${fileFailures}, Duration: ${uploadDuration}ms`);
        
        if (uploadDuration > 5000) {
          console.warn(`[UPLOAD-CLEANUP-SCHEDULER] ⚠️ WARNING: Upload processing took ${uploadDuration}ms (>5s) - Upload: ${upload.id}`);
        }
        
        uploadsSucceeded++;
      } catch (error) {
        const uploadDuration = Date.now() - uploadStartTime;
        console.error(`[UPLOAD-CLEANUP-SCHEDULER] ❌ Error processing upload - ID: ${upload.id}, Duration: ${uploadDuration}ms`, error);
        uploadsFailed++;
      } finally {
        uploadsProcessed++;
      }
    }
    
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const memUsageEnd = process.memoryUsage();
    const cpuUsageEnd = process.cpuUsage(cpuUsageStart);
    
    console.log('========================================');
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Cron Completed at ${endTime.toISOString()}`);
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Summary - Total: ${uploadsProcessed}, Success: ${uploadsSucceeded}, Failed: ${uploadsFailed}`);
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Files Deleted: ${totalFilesDeleted}, Collections Dropped: ${totalCollectionsDropped}`);
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Total Duration: ${duration}ms`);
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Memory Usage (End): RSS=${(memUsageEnd.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsageEnd.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] Memory Delta: RSS=${((memUsageEnd.rss - memUsageStart.rss) / 1024 / 1024).toFixed(2)}MB, Heap=${((memUsageEnd.heapUsed - memUsageStart.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
    console.log(`[UPLOAD-CLEANUP-SCHEDULER] CPU Usage: User=${(cpuUsageEnd.user / 1000).toFixed(2)}ms, System=${(cpuUsageEnd.system / 1000).toFixed(2)}ms`);
    
    if (duration > 30000) {
      console.error(`[UPLOAD-CLEANUP-SCHEDULER] 🚨 CRITICAL: Cron execution took ${duration}ms (>30s threshold) - HIGH CPU RISK!`);
    } else if (duration > 10000) {
      console.warn(`[UPLOAD-CLEANUP-SCHEDULER] ⚠️ WARNING: Cron execution took ${duration}ms (>10s threshold)`);
    }
    
    console.log('========================================');
  }
}
