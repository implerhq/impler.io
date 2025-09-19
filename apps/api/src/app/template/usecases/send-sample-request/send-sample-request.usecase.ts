/* eslint-disable multiline-comment-style */
import { Injectable, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { WebhookDestinationRepository, ColumnRepository } from '@impler/dal';
import axios from 'axios';
import { ColumnTypesEnum, IColumn } from '@impler/shared';
import { ValidationTypesEnum } from '@impler/client';
import * as dayjs from 'dayjs';

@Injectable()
export class SendSampleRequest implements OnModuleInit {
  private faker: any;

  constructor(
    private webookDataRepository: WebhookDestinationRepository,
    private columnRepository: ColumnRepository
  ) {}

  async onModuleInit() {
    // Dynamically import faker to handle ES module compatibility
    this.faker = (await import('@faker-js/faker')).faker;
  }

  async execute({ templateId }: { templateId: string }) {
    const webhookDestination = await this.webookDataRepository.findOne({
      _templateId: templateId,
    });

    if (!webhookDestination?.callbackUrl) {
      throw new HttpException('Webhook URL not configured', HttpStatus.NOT_FOUND);
    }

    const columns = await this.columnRepository.find({ _templateId: templateId });
    const sampleData = this.generateSampleData(columns as IColumn[], 5);

    try {
      await this.sendSampleToWebhook(webhookDestination.callbackUrl, sampleData, webhookDestination);

      return { success: true, sampleData, webhookResponse: { sent: true } };
    } catch (error: any) {
      return { success: false, sampleData, webhookResponse: { error: error.message, sent: false } };
    }
  }

  private generateSampleData(columns: IColumn[], count = 5): Record<string, any>[] {
    return Array.from({ length: count }, () => {
      const record: Record<string, any> = {};
      columns.forEach((column) => {
        const value = this.generateValue(column);
        record[column.key] = value;
      });

      return record;
    });
  }

  private generateValue(column: IColumn): any {
    let value: any;

    if (column.selectValues?.length > 0) {
      value = this.faker.helpers.arrayElement(column.selectValues);

      return value;
    }

    if (
      column.defaultValue !== undefined &&
      column.defaultValue !== null &&
      column.defaultValue !== '' &&
      column.defaultValue !== '<<null>>'
    ) {
      value = column.defaultValue;

      return value;
    }
    switch (column.type) {
      case ColumnTypesEnum.STRING:
        value = this.faker.lorem.words(3);
        break;
      case ColumnTypesEnum.NUMBER:
        value = this.generateNumberValue(column);
        break;
      case ColumnTypesEnum.DOUBLE:
        value = this.generateDoubleValue(column);
        break;
      case ColumnTypesEnum.DATE:
        value = this.generateDateValue(column);
        break;
      case ColumnTypesEnum.EMAIL:
        value = this.faker.internet.email();
        break;
      case 'boolean':
        value = this.faker.datatype.boolean();
        break;
      case ColumnTypesEnum.REGEX:
        value = this.generateRegexValue(column);
        break;
      default:
        value = this.faker.lorem.words(3);
        break;
    }

    return value;
  }

  private generateNumberValue(column: IColumn): number {
    // Check if we need specific digit count
    const digits = this.getDigitsValidation(column);
    if (digits) {
      return this.faker.number.int({ min: digits.min, max: digits.max });
    }

    // Otherwise use range or defaults
    const range = this.getRangeValidation(column) || { min: 1, max: 100 };

    return this.faker.number.int(range);
  }

  private generateDoubleValue(column: IColumn): number {
    const range = this.getRangeValidation(column) || { min: 0, max: 100 };

    return this.faker.number.float({ ...range, fractionDigits: 2 });
  }

  private getDigitsValidation(column: IColumn) {
    const validation = column.validations?.find((validate) => validate.validate === ValidationTypesEnum.DIGITS);
    if (!validation || !('min' in validation)) return null;

    const digits = this.faker.number.int({ min: validation.min, max: validation.max });

    return digits === 1 ? { min: 1, max: 9 } : { min: 10 ** (digits - 1), max: 10 ** digits - 1 };
  }

  private getRangeValidation(column: IColumn) {
    const validation = column.validations?.find((validate) => validate.validate === ValidationTypesEnum.RANGE);
    if (!validation || !('min' in validation)) return null;

    return {
      min: validation.min ?? 0,
      max: validation.max ?? 100,
    };
  }
  private generateDateValue(column: IColumn): string {
    const dateFormat = column.dateFormats && column.dateFormats.length > 0 ? column.dateFormats[0] : 'YYYY-MM-DD';

    return dayjs().format(dateFormat);
  }

  private generateRegexValue(column: IColumn): string {
    return this.faker.helpers.fromRegExp(column.regex);
  }

  private async sendSampleToWebhook(webhookUrl: string, sampleData: Record<string, any>[], template: any) {
    const sendData = {
      page: 1,
      fileName: 'sample-data.json',
      template: template.name,
      uploadId: `sample-${template._id}-${Date.now()}`,
      data: sampleData,
      totalRecords: sampleData.length,
      chunkSize: sampleData.length,
      extra: '',
      totalPages: 1,
    };

    const allData = {
      data: sendData,
      uploadId: sendData.uploadId,
      page: 1,
      method: 'POST',
      url: webhookUrl,
      headers: null,
      isRetry: false,
    };

    return await this.makeApiCall(allData);
  }

  private async makeApiCall(allData: {
    data: any;
    uploadId: string;
    page: number;
    method: string;
    url: string;
    headers: any;
    isRetry: boolean;
  }) {
    try {
      const response = await axios({
        method: allData.method as 'POST',
        url: allData.url,
        data: allData.data,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Impler-Sample-Request/1.0',
          ...allData.headers,
        },
        timeout: 30000,
      });

      return {
        status: 'SUCCESS',
        statusCode: response.status,
        response: response.data,
        callDate: new Date(),
        _uploadId: allData.uploadId,
      };
    } catch (error: any) {
      return {
        status: 'FAILED',
        statusCode: error.response?.status || 500,
        error: error.response?.data || error.message,
        callDate: new Date(),
        _uploadId: allData.uploadId,
      };
    }
  }
}
