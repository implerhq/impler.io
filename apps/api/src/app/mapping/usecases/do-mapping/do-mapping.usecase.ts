import { Injectable } from '@nestjs/common';
import { UploadStatusEnum } from '@impler/shared';
import { ColumnEntity, ColumnRepository, MappingEntity, MappingRepository, UploadRepository } from '@impler/dal';
import { DoMappingCommand } from './do-mapping.command';

@Injectable()
export class DoMapping {
  constructor(
    private columnRepository: ColumnRepository,
    private mappingRepository: MappingRepository,
    private uploadRepository: UploadRepository
  ) {}

  async execute(command: DoMappingCommand) {
    const columns = await this.columnRepository.find(
      {
        _templateId: command._templateId,
      },
      'key alternateKeys sequence',
      {
        sort: 'sequence',
      }
    );
    const mapping = this.buildMapping(columns, command.headings, command._uploadId);
    const createdHeadings = await this.mappingRepository.createMany(mapping);
    await this.uploadRepository.update({ _id: command._uploadId }, { status: UploadStatusEnum.MAPPING });

    return createdHeadings;
  }

  private buildMapping(columns: ColumnEntity[], headings: string[], _uploadId: string) {
    const mappings: MappingEntity[] = [];
    for (const column of columns) {
      const heading = this.findBestMatchingHeading(headings, column.key, column.alternateKeys);
      if (heading) {
        mappings.push(this.buildMappingItem(column._id, _uploadId, heading));
      } else {
        mappings.push(this.buildMappingItem(column._id, _uploadId));
      }
    }

    return mappings;
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
    return String(a).localeCompare(String(b), undefined, { sensitivity: 'accent' }) === 0;
  }

  private buildMappingItem(columnId: string, uploadId: string, heading?: string): MappingEntity {
    return {
      _columnId: columnId,
      _uploadId: uploadId,
      columnHeading: heading || null,
    };
  }
}
