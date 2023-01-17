import { Injectable } from '@nestjs/common';
import { TemplateEntity, UploadEntity, UploadRepository } from '@impler/dal';
import { StartProcessCommand } from './start-process.command';
import { QueuesEnum, UploadStatusEnum } from '@impler/shared';
import { QueueService } from '@shared/storage/queue.service';

@Injectable()
export class StartProcess {
  constructor(private uploadRepository: UploadRepository, private queueService: QueueService) {}

  async execute(command: StartProcessCommand): Promise<UploadEntity> {
    let upload = await this.uploadRepository.getUploadWithTemplate(command._uploadId, ['callbackUrl']);
    // if template has callbackUrl then start sending data to the callbackUrl
    if ((upload._templateId as unknown as TemplateEntity)?.callbackUrl) {
      upload = await this.uploadRepository.findOneAndUpdate(
        { _id: command._uploadId },
        { status: UploadStatusEnum.PROCESSING, processInvalidRecords: command.processInvalidRecords }
      );

      this.queueService.publishToQueue(QueuesEnum.PROCESS_FILE, { uploadId: command._uploadId });
    } else {
      // else complete the upload process
      upload = await this.uploadRepository.findOneAndUpdate(
        { _id: command._uploadId },
        { status: UploadStatusEnum.COMPLETED, processInvalidRecords: command.processInvalidRecords }
      );
    }

    return upload;
  }
}
