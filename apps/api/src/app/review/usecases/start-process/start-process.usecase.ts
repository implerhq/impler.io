import { Injectable } from '@nestjs/common';
import { QueuesEnum, UploadStatusEnum } from '@impler/shared';
import { QueueService } from '@shared/services/queue.service';
import { TemplateEntity, UploadEntity, UploadRepository } from '@impler/dal';

@Injectable()
export class StartProcess {
  constructor(private uploadRepository: UploadRepository, private queueService: QueueService) {}

  async execute(_uploadId: string): Promise<UploadEntity> {
    let upload = await this.uploadRepository.getUploadWithTemplate(_uploadId, ['destination']);

    // if template destination has callbackUrl then start sending data to the callbackUrl
    if ((upload._templateId as unknown as TemplateEntity)?.destination) {
      upload = await this.uploadRepository.findOneAndUpdate(
        { _id: _uploadId },
        { status: UploadStatusEnum.PROCESSING }
      );
    } else {
      // else complete the upload process
      upload = await this.uploadRepository.findOneAndUpdate({ _id: _uploadId }, { status: UploadStatusEnum.COMPLETED });
    }
    this.queueService.publishToQueue(QueuesEnum.END_IMPORT, {
      uploadId: _uploadId,
      destination: (upload._templateId as unknown as TemplateEntity)?.destination,
    });

    return upload;
  }
}
