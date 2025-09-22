import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadRepository, TemplateRepository, WebhookDestinationRepository } from '@impler/dal';
import { QueueService } from '@shared/services/queue.service';
import { QueuesEnum, DestinationsEnum } from '@impler/shared';

@Injectable()
export class RetryUpload {
  constructor(
    private uploadRepository: UploadRepository,
    private templateRepository: TemplateRepository,
    private webhookDestinationRepository: WebhookDestinationRepository,
    private queueService: QueueService
  ) {}

  async execute(uploadId: string) {
    const upload = await this.uploadRepository.findById(uploadId);

    if (!upload) {
      throw new Error('Upload not found');
    }

    const template = await this.templateRepository.findOne({ _id: upload._templateId });

    if (!template || template.destination !== DestinationsEnum.WEBHOOK) {
      throw new BadRequestException('Template does not have a webhook destination');
    }

    const webhookDestination = await this.webhookDestinationRepository.findOne({ _templateId: upload._templateId });

    if (!webhookDestination) {
      throw new BadRequestException('Webhook destination not found for template');
    }

    this.queueService.publishToQueue(QueuesEnum.SEND_WEBHOOK_DATA, {
      uploadId: upload._id,
      isRetry: true,
    });

    return {
      success: true,
      message: 'Retry request queued successfully',
      upload: upload,
    };
  }
}
