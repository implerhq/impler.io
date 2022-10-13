import { Injectable } from '@nestjs/common';
import { ColumnEntity, ColumnRepository } from '@impler/dal';
import { DoMappingCommand } from './do-mapping.command';
import Levenshtein from 'levenshtein';

@Injectable()
export class DoMapping {
  constructor(private columnRepository: ColumnRepository) {}

  async execute(command: DoMappingCommand) {
    const columns = await this.columnRepository.find(
      {
        templateId: command._templateId,
      },
      'columnKeys sequence'
    );
    console.log(command, columns);
    this.buildMapping(columns, command.headings);
    /*
     * TODO: Build Mappings based on column.sequence match column based on column.columnKeys and headings
     *       columns.length = mappings.length
     *
     * TODO: Update Upload status to Mapping
     */
    // return this.uploadRepository.findOne({ _id: command.uploadId });
  }

  private buildMapping(columns: ColumnEntity[], headings: string[]) {
    const mappings = [];
    for (const column of columns) {
      const ls = new Levenshtein(column.key, headings[0]);
      console.log(ls.distance);
    }

    return mappings;
  }
}
