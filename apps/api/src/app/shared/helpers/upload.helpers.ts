import { UploadStatusEnum } from '@impler/shared';
import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';

export function validateUploadStatus(currentStatus: UploadStatusEnum, expectedStatus: UploadStatusEnum[]): boolean {
  if (expectedStatus.includes(currentStatus)) return true;
  else {
    if (currentStatus === UploadStatusEnum.UPLOADED) {
      throw new BadRequestException(APIMessages.DO_MAPPING_FIRST);
    } else if (currentStatus === UploadStatusEnum.MAPPED) {
      throw new BadRequestException(APIMessages.DO_REVIEW_FIRST);
    } else if (currentStatus === UploadStatusEnum.REVIEWED) {
      throw new BadRequestException(APIMessages.DO_CONFIRM_FIRST);
    } else if (currentStatus === UploadStatusEnum.CONFIRMED) {
      throw new BadRequestException(APIMessages.ALREADY_CONFIRMED);
    } else if (currentStatus === UploadStatusEnum.PROCESSING) {
      throw new BadRequestException(APIMessages.IN_PROGRESS);
    } else if (currentStatus === UploadStatusEnum.COMPLETED) {
      throw new BadRequestException(APIMessages.COMPLETED);
    }
  }
}
