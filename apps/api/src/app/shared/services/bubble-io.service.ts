import axios, { AxiosError } from 'axios';
import { Injectable } from '@nestjs/common';
import { BubbleBaseService } from '@impler/services';
import { BubbleDestinationEntity } from '@impler/dal';
import { ColumnTypesEnum, DEFAULT_KEYS_OBJ, IColumn } from '@impler/shared';

interface IThingsResponse {
  response: {
    cursor: number;
    count: number;
    remaining: number;
    results: Record<string, string | number>[];
  };
}

@Injectable()
export class BubbleIoService extends BubbleBaseService {
  async getDatatypeData(data: Omit<BubbleDestinationEntity, '_id' | '_templateId'>) {
    try {
      const url = this.createBubbleIoUrl(data);
      const response = await axios.get<IThingsResponse>(url, {
        headers: {
          Authorization: `Bearer ${data.apiPrivateKey}`,
        },
      });
      if (!response.data.response.results.length)
        throw new Error('Datatype is empty. Please add at least one entry to the datatype');

      return response.data.response.results;
    } catch (error: unknown) {
      this.throwRequestError(error as AxiosError);
    }
  }

  createColumns(data: Record<string, string | number>[], _templateId: string) {
    const bubbleIoDefaultColumns = ['Modified Date', 'Created Date', 'Created By', '_id', 'Slug'];
    const columns: Partial<IColumn>[] = [];
    const takenCols = new Set();
    for (const record of data) {
      for (const colKey of Object.keys(record)) {
        if (!bubbleIoDefaultColumns.includes(colKey) && !takenCols.has(colKey)) {
          const columnType = this.assumeValueType(record[colKey]);
          columns.push({
            name: colKey,
            type: columnType.type,
            key: colKey,
            isRequired: false,
            isUnique: false,
            _templateId,
            defaultValue: DEFAULT_KEYS_OBJ.null,
            selectValues: columnType.selectValues,
            dateFormats: columnType.dateFormats,
          });
          takenCols.add(colKey);
        }
      }
    }

    return columns;
  }

  assumeValueType(value: any) {
    const obj = {
      selectValues: [],
      dateFormats: ['MM/DD/YYYY', 'MM/DD/YY', 'M/D/YY', 'MM/D/YY', 'M/DD/YY', 'M/D/YYYY', 'MM/D/YYYY', 'M/DD/YYYY'],
      type: ColumnTypesEnum.STRING,
    };
    // Check if the value is an email
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      obj.type = ColumnTypesEnum.EMAIL;
    }

    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      obj.type = ColumnTypesEnum.NUMBER;
    }

    // Check if the value is a date
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
      obj.type = ColumnTypesEnum.DATE;
    }

    // Check if the value is a boolean
    if (value === true || value === false) {
      obj.type = ColumnTypesEnum.SELECT;
      obj.selectValues = [true, false];
    }

    // Default case: generic string
    return obj;
  }
}
