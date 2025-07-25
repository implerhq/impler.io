import { Injectable } from '@nestjs/common';
import { DalService, UploadRepository } from '@impler/dal';

@Injectable()
export class DeleteRecord {
  constructor(
    private dalService: DalService,
    private uploadRepository: UploadRepository
  ) {}

  async execute(
    uploadId: string,
    recordIndexesToDelete: number[],
    validRecordsToDelete: number,
    invalidRecordsToDelete: number
  ) {
    await this.dalService.deleteRecords(uploadId, recordIndexesToDelete);

    if (typeof validRecordsToDelete !== 'undefined' && typeof invalidRecordsToDelete !== 'undefined') {
      // Get current upload statistics to prevent negative values
      const currentUploadData = await this.uploadRepository.findOne({ _id: uploadId });

      if (currentUploadData) {
        // Calculate safe decrement values to prevent database corruption
        const safeValidRecordsDecrement = Math.min(validRecordsToDelete, currentUploadData.validRecords || 0);
        const safeInvalidRecordsDecrement = Math.min(invalidRecordsToDelete, currentUploadData.invalidRecords || 0);
        const safeTotalRecordsDecrement = Math.min(recordIndexesToDelete.length, currentUploadData.totalRecords || 0);

        await this.uploadRepository.update(
          {
            _id: uploadId,
          },
          {
            $inc: {
              totalRecords: -safeTotalRecordsDecrement,
              validRecords: -safeValidRecordsDecrement,
              invalidRecords: -safeInvalidRecordsDecrement,
            },
          }
        );

        // Double-check and ensure no negative values exist in database
        const updatedUploadData = await this.uploadRepository.findOne({ _id: uploadId });
        if (updatedUploadData) {
          const fieldsToCorrect: any = {};
          let requiresCorrection = false;

          if ((updatedUploadData.totalRecords || 0) < 0) {
            fieldsToCorrect.totalRecords = 0;
            requiresCorrection = true;
          }
          if ((updatedUploadData.validRecords || 0) < 0) {
            fieldsToCorrect.validRecords = 0;
            requiresCorrection = true;
          }
          if ((updatedUploadData.invalidRecords || 0) < 0) {
            fieldsToCorrect.invalidRecords = 0;
            requiresCorrection = true;
          }

          if (requiresCorrection) {
            await this.uploadRepository.update({ _id: uploadId }, { $set: fieldsToCorrect });
          }
        }
      }
    }
  }
}
