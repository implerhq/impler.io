import { DestinationsEnum } from '@impler/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TemplateRepository, BubbleDestinationRepository, WebhookDestinationRepository } from '@impler/dal';
import { BubbleIoService } from '@shared/services/bubble-io.service';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { UpdateCustomization } from '../update-customization/update-customization.usecase';
import { UpdateDestinationCommand, BubbleIoDestinationObject } from '../../commands/update-destination.command';

@Injectable()
export class UpdateDestination {
  constructor(
    private bubbleIoService: BubbleIoService,
    private templateRepository: TemplateRepository,
    private updateCustomization: UpdateCustomization,
    private bubbleDestinationRepo: BubbleDestinationRepository,
    private webhookDestinationRepo: WebhookDestinationRepository
  ) {}

  async execute(_templateId: string, data: UpdateDestinationCommand) {
    const template = await this.templateRepository.findById(_templateId);

    if (!template) {
      throw new DocumentNotFoundException('Template', _templateId);
    }

    if (!data.destination) {
      if (template.destination === DestinationsEnum.WEBHOOK) this.webhookDestinationRepo.delete({ _templateId });
      else if (template.destination === DestinationsEnum.BUBBLEIO) this.bubbleDestinationRepo.delete({ _templateId });

      await this.templateRepository.update(
        { _id: _templateId },
        {
          $unset: {
            destination: 1,
          },
        }
      );

      return null;
    } else if (data.destination === DestinationsEnum.WEBHOOK) {
      await this.webhookDestinationRepo.findOneAndUpdate(
        { _templateId },
        {
          ...data.webhook,
          _templateId,
        },
        { upsert: true }
      );
    } else if (data.destination === DestinationsEnum.BUBBLEIO) {
      try {
        await this.testBubbleIoConnection(data.bubbleIo);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      await this.bubbleDestinationRepo.findOneAndUpdate(
        { _templateId },
        {
          ...data.bubbleIo,
          _templateId,
        },
        { upsert: true }
      );
    }

    await this.templateRepository.update({ _id: _templateId }, { destination: data.destination });
    await this.updateCustomization.createOrReset(_templateId, { destination: data.destination });

    return {
      destination: data.destination,
      ...(data.webhook
        ? {
            webhook: {
              ...data.webhook,
              _templateId,
            },
          }
        : {}),
      ...(data.bubbleIo
        ? {
            bubbleIo: {
              ...data.bubbleIo,
              _templateId,
            },
          }
        : {}),
    };
  }

  async testBubbleIoConnection(data: BubbleIoDestinationObject) {
    await this.bubbleIoService.getDatatypeData(data);
  }
}
