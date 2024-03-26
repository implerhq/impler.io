import { Injectable } from '@nestjs/common';
import {
  TemplateRepository,
  BubbleDestinationRepository,
  WebhookDestinationRepository,
  WebhookDestinationEntity,
  BubbleDestinationEntity,
} from '@impler/dal';
import { DestinationsEnum } from '@impler/shared';

@Injectable()
export class GetDestination {
  constructor(
    private templateRepository: TemplateRepository,
    private bubbleDestinationRepo: BubbleDestinationRepository,
    private webhookDestinationRepo: WebhookDestinationRepository
  ) {}

  async execute(_templateId: string) {
    const template = await this.templateRepository.findById(_templateId);

    const destinationData: {
      destination: DestinationsEnum;
      webhook?: WebhookDestinationEntity;
      bubbleIo?: BubbleDestinationEntity;
    } = {
      destination: template.destination,
    };
    if (template.destination) {
      if (template.destination === DestinationsEnum.BUBBLEIO) {
        destinationData.bubbleIo = await this.bubbleDestinationRepo.findOne({ _templateId });
      } else if (template.destination === DestinationsEnum.WEBHOOK) {
        destinationData.webhook = await this.webhookDestinationRepo.findOne({ _templateId });
      }
    }

    return destinationData;
  }
}
