import { Injectable } from '@nestjs/common';
import { ReplaceCommand } from './replace.command';
import { DalService, UploadRepository } from '@impler/dal';
import { ColumnTypesEnum, ITemplateSchemaItem } from '@impler/shared';

@Injectable()
export class Replace {
  constructor(
    private dalService: DalService,
    private uploadRepository: UploadRepository
  ) {}

  escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  isNumeric(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(Number(value));
  }

  async execute(_uploadId: string, { column, caseSensitive, find, replace, matchEntireCell }: ReplaceCommand) {
    const uploadInfo = await this.uploadRepository.findById(_uploadId);
    const recordCollectionModal = this.dalService.getRecordCollection(_uploadId);
    const numberColumnHeadings = new Set<string>();
    const columns = JSON.parse(uploadInfo.customSchema);
    (columns as ITemplateSchemaItem[]).forEach((columnItem) => {
      if (columnItem.type === ColumnTypesEnum.NUMBER || columnItem.type === ColumnTypesEnum.DOUBLE)
        numberColumnHeadings.add(columnItem.key);
    });
    if (find === '') matchEntireCell = true;

    const updateStages = [];
    const fieldsToProcess = column ? [column] : uploadInfo.headings;

    fieldsToProcess.forEach((fieldName) => {
      const path = `record.${fieldName}`;
      const isNumberColumn = numberColumnHeadings.has(fieldName);

      let formattedReplace: string | number = replace;
      if (isNumberColumn && this.isNumeric(replace)) {
        formattedReplace = parseFloat(replace);
      }

      let matchCondition;
      let replaceOperation;

      if (find === '') {
        matchCondition = {
          $or: [
            { $eq: ['$' + path, ''] },
            { $regexMatch: { input: { $toString: '$' + path }, regex: /^\s*$/ } },
            { $eq: ['$' + path, null] },
          ],
        };
        replaceOperation = { $literal: formattedReplace };
      } else if (isNumberColumn) {
        // For number columns, we'll use string operations and then convert back to number
        const escapedFind = this.escapeRegExp(find);
        matchCondition = {
          $regexMatch: {
            input: { $toString: '$' + path },
            regex: escapedFind,
            options: caseSensitive ? '' : 'i',
          },
        };
        replaceOperation = {
          $cond: {
            if: { $eq: [formattedReplace, ''] },
            then: null,
            else: {
              $cond: {
                if: { $eq: [{ $type: '$' + path }, 'number'] },
                then: {
                  $toDouble: {
                    $replaceAll: {
                      input: { $toString: '$' + path },
                      find: find,
                      replacement: formattedReplace,
                    },
                  },
                },
                else: formattedReplace,
              },
            },
          },
        };
      } else {
        const regex = new RegExp(
          matchEntireCell ? `^${this.escapeRegExp(find)}$` : this.escapeRegExp(find),
          caseSensitive ? '' : 'i'
        );
        matchCondition = { $regexMatch: { input: { $toString: '$' + path }, regex } };
        replaceOperation = {
          $replaceAll: {
            input: { $toString: '$' + path },
            find: find,
            replacement: formattedReplace,
          },
        };
      }

      updateStages.push({
        $set: {
          [`record.${fieldName}`]: {
            $cond: {
              if: matchCondition,
              then: replaceOperation,
              else: `$record.${fieldName}`,
            },
          },
        },
      });

      updateStages.push({
        $set: {
          [`updated.${fieldName}`]: {
            $cond: {
              if: { $ne: [`$record.${fieldName}`, `$_oldRecord.${fieldName}`] },
              then: true,
              else: '$$REMOVE',
            },
          },
        },
      });
    });

    // Add a stage to store the original record state
    updateStages.unshift({ $set: { _oldRecord: '$record' } });

    // Add a final stage to remove the temporary _oldRecord field
    updateStages.push({ $unset: '_oldRecord' });

    const result = await recordCollectionModal.updateMany({}, updateStages, { multi: true });

    return result;
  }
}
