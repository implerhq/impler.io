import { Injectable } from '@nestjs/common';
import { UploadEntity, UploadRepository } from '@impler/dal';
import { StartProcessCommand } from './start-process.command';
import { QueuesEnum, UploadStatusEnum } from '@impler/shared';
import { QueueService } from '../../../shared/storage/queue.service';

@Injectable()
export class StartProcess {
  constructor(private uploadRepository: UploadRepository, private queueService: QueueService) {}

  async execute(command: StartProcessCommand): Promise<UploadEntity> {
    const upload = await this.uploadRepository.findOneAndUpdate(
      { _id: command._uploadId },
      { status: UploadStatusEnum.PROCESSING, processInvalidRecords: command.processInvalidRecords }
    );

    this.queueService.publishToQueue(QueuesEnum.PROCESS_FILE, { uploadId: command._uploadId });

    return upload;
  }
}
