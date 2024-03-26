import { BadRequestException, Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';
import { DestinationsEnum } from '@impler/shared';
import { BubbleIoService } from '@shared/services/bubble-io.service';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { UpdateTemplateColumns } from '../update-template-columns/update-template-columns.usecase';
import { UpdateDestinationCommand } from '../../commands/update-destination.command';

@Injectable()
export class MapBubbleIoColumns {
  constructor(
    private bubbleIoService: BubbleIoService,
    private templateRepository: TemplateRepository,
    private updateTemplateColumns: UpdateTemplateColumns
  ) {}

  async execute(_templateId: string, data: UpdateDestinationCommand) {
    const template = await this.templateRepository.findById(_templateId);

    if (!template) {
      throw new DocumentNotFoundException('Template', _templateId);
    }

    if (data.destination === DestinationsEnum.BUBBLEIO) {
      try {
        const things = await this.bubbleIoService.getDatatypeData(data.bubbleIo);
        const columns = this.bubbleIoService.createColumns(things, _templateId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await this.updateTemplateColumns.execute(columns, _templateId);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

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
}
