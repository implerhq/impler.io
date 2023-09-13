import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { Defaults, ITemplateSchemaItem, UploadStatusEnum } from '@impler/shared';
import { DoMappingCommand } from './do-mapping.command';

@Injectable()
export class DoMapping {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(command: DoMappingCommand) {
    const uploadInfo = await this.uploadRepository.findById(command._uploadId, 'customSchema');
    const updatedTemplateSchema = this.buildMapping(JSON.parse(uploadInfo.customSchema), command.headings);
    await this.uploadRepository.update(
      { _id: command._uploadId },
      { status: UploadStatusEnum.MAPPING, customSchema: JSON.stringify(updatedTemplateSchema) }
    );

    return updatedTemplateSchema;
  }

  private buildMapping(columns: ITemplateSchemaItem[], headings: string[]): ITemplateSchemaItem[] {
    for (const column of columns) {
      const heading = this.findBestMatchingHeading(headings, column.key, column.alternateKeys);
      if (heading) {
        column.columnHeading = heading;
      }
    }

    return columns;
  }

  private findBestMatchingHeading(headings: string[], key: string, alternateKeys: string[]): string | null {
    const mappedHeading = headings.find((heading: string) => this.checkStringEqual(heading, key));
    if (mappedHeading) {
      // compare key
      return mappedHeading;
    } else if (Array.isArray(alternateKeys) && alternateKeys.length) {
      // compare alternateKeys
      const intersection = headings.find(
        (heading: string) => !!alternateKeys.find((altKey) => this.checkStringEqual(altKey, heading))
      );

      return intersection;
    }

    return null;
  }

  private checkStringEqual(a: string, b: string): boolean {
    return String(a).localeCompare(String(b), undefined, { sensitivity: 'accent' }) === Defaults.ZERO;
  }
}
