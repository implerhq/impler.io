import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidateMappingCommand } from './validate-mapping.command';

import { ITemplateSchemaItem } from '@impler/shared';

@Injectable()
export class ValidateMapping {
  execute(command: ValidateMappingCommand[], _uploadId: string, columns: ITemplateSchemaItem[], headings: string[]) {
    // check if mapping data contains duplicates
    const mappings = [...new Map(command.map((item) => [item.key, item])).values()];
    if (mappings.length !== command.length) throw new BadRequestException('Mapping data contains duplicates');

    // check if mapping data headings are valid
    const columnHeadings = command.map((mapping) => mapping.columnHeading).filter((heading) => !!heading);
    const isAllHeadingsAreValid = columnHeadings.every((heading) => headings.includes(heading));
    if (!isAllHeadingsAreValid) throw new BadRequestException(`Mapping data contains invalid columnHeading values`);

    // check if mapping data has required columns
    const providedColumnKeys = command.filter((item) => !!item.columnHeading).map((item) => item.key);
    for (const columnEntity of columns) {
      if (columnEntity.isRequired && !providedColumnKeys.includes(columnEntity.key)) {
        throw new BadRequestException(`${columnEntity.name} is required`);
      }
    }
  }
}
