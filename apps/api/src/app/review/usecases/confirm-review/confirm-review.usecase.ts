import { Injectable } from '@nestjs/common';
import { UploadEntity, UploadRepository } from '@impler/dal';
import { ConfirmReviewCommand } from './confirm-review.command';
import { UploadStatusEnum } from '@impler/shared';

@Injectable()
export class ConfirmReview {
  constructor(private uploadRepository: UploadRepository) {}

  execute(command: ConfirmReviewCommand): Promise<UploadEntity> {
    return this.uploadRepository.findOneAndUpdate(
      { _id: command._uploadId },
      { status: UploadStatusEnum.CONFIRMED, processInvalidRecords: command.processInvalidRecords }
    );
  }
}
