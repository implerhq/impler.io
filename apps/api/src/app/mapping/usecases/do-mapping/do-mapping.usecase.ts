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
    const mapHeadings = [...headings];
    for (const column of columns) {
      const headingIndex = this.findBestMatchingHeading(mapHeadings, column.key, column.alternateKeys);
      if (headingIndex > Defaults.MINUS_ONE) {
        const [heading] = mapHeadings.splice(headingIndex, Defaults.ONE);
        if (heading) {
          column.columnHeading = heading;
        }
      }
    }

    return columns;
  }

  private findBestMatchingHeading(headings: string[], key: string, alternateKeys: string[]): number {
    const mappedHeadingIndex = headings.findIndex((heading: string) => this.checkStringEqual(heading, key));
    if (mappedHeadingIndex > Defaults.MINUS_ONE) {
      // compare key
      return mappedHeadingIndex;
    } else if (Array.isArray(alternateKeys) && alternateKeys.length) {
      // compare alternateKeys
      const intersectionIndex = headings.findIndex(
        (heading: string) => !!alternateKeys.find((altKey) => this.checkStringEqual(altKey, heading))
      );

      return intersectionIndex;
    }

    return Defaults.MINUS_ONE;
  }

  private checkStringEqual(a: string, b: string): boolean {
    const str1 = String(a).trim().toLowerCase();
    const str2 = String(b).trim().toLowerCase();

    const eualityCheck = str1.localeCompare(str2, undefined, { sensitivity: 'accent' }) === Defaults.ZERO;
    if (eualityCheck) return true;

    const includeCheck = str1.includes(str2) || str2.includes(str1);

    return includeCheck;
  }
}
