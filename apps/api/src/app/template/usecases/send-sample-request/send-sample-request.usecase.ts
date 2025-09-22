/* eslint-disable multiline-comment-style */
import { Injectable, HttpException, HttpStatus, OnModuleInit, BadRequestException } from '@nestjs/common';
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
    this.faker = (await import('@faker-js/faker')).faker;
  }

  async execute({
    templateId,
    extra,
    authHeaderValue,
  }: {
    templateId: string;
    extra?: JSON | string;
    authHeaderValue?: string;
  }) {
    const webhookDestination = await this.webookDataRepository.findOne({
      _templateId: templateId,
    });

    if (!webhookDestination?.callbackUrl) {
      throw new HttpException('Webhook URL not configured', HttpStatus.NOT_FOUND);
    }

    const columns = await this.columnRepository.find({ _templateId: templateId });
    const chunkSize = webhookDestination.chunkSize || 5;
    const sampleRecordCount = 15; // Generate more records to test chunking
    const sampleData = this.generateSampleData(columns as IColumn[], sampleRecordCount);

    try {
      const results = await this.sendChunkedData({
        webhookUrl: webhookDestination.callbackUrl,
        sampleData,
        webhookDestination,
        chunkSize,
        extra,
        page: 1,
        authHeaderValue,
      });

      return {
        success: true,
        sampleData,
        totalRecords: sampleData.length,
        chunkSize,
        totalPages: this.getTotalPages(sampleData.length, chunkSize),
        results,
      };
    } catch (error: any) {
      throw new BadRequestException(error);
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

  private getTotalPages(totalRecords: number, pageSize: number): number {
    return Math.ceil(totalRecords / pageSize);
  }

  private getNextPageNumber({
    currentPage,
    chunkSize,
    totalRecords,
  }: {
    currentPage: number;
    totalRecords: number;
    chunkSize: number;
  }): number | null {
    if (totalRecords > currentPage * chunkSize) {
      return currentPage + 1;
    }

    return null;
  }

  private async sendChunkedData({
    webhookUrl,
    sampleData,
    webhookDestination,
    chunkSize,
    extra,
    authHeaderValue,
    page = 1,
  }: {
    webhookUrl: string;
    sampleData: Record<string, any>[];
    webhookDestination: any;
    chunkSize: number;
    extra?: JSON | string;
    authHeaderValue?: string;
    page?: number;
  }): Promise<any[]> {
    const startIndex = (page - 1) * chunkSize;
    const endIndex = Math.min(startIndex + chunkSize, sampleData.length);
    const chunk = sampleData.slice(startIndex, endIndex);

    if (chunk.length === 0) {
      return [];
    }

    const totalPages = this.getTotalPages(sampleData.length, chunkSize);
    const result = await this.sendSampleToWebhook(
      webhookUrl,
      chunk,
      webhookDestination,
      page,
      totalPages,
      extra,
      authHeaderValue
    );

    const nextPageNumber = this.getNextPageNumber({
      currentPage: page,
      chunkSize,
      totalRecords: sampleData.length,
    });

    if (nextPageNumber) {
      return await this.sendChunkedData({
        webhookUrl,
        sampleData,
        webhookDestination,
        chunkSize,
        extra,
        authHeaderValue,
        page: nextPageNumber,
      });
    }

    return [result];
  }

  private async sendSampleToWebhook(
    webhookUrl: string,
    sampleData: Record<string, any>[],
    template: any,
    page = 1,
    totalPages = 1,
    extra?: JSON | string,
    authHeaderValue?: string
  ) {
    const uploadId = `sample-${template._id}-${Date.now()}-page-${page}`;
    const sendData = {
      page,
      fileName: 'sample-data.json',
      template: template.name || 'Sample Template',
      uploadId,
      data: sampleData,
      totalRecords: sampleData.length,
      chunkSize: sampleData.length,
      extra: extra ? JSON.parse(extra as string) : '',
      totalPages,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Impler-Sample-Request/1.0',
    };

    if (authHeaderValue && template.authHeaderName) {
      headers[template.authHeaderName] = authHeaderValue;
    } else if (template.authHeaderName && template.authHeaderValue) {
      headers[template.authHeaderName] = template.authHeaderValue;
    }

    const allData = {
      data: sendData,
      uploadId: sendData.uploadId,
      page,
      method: 'POST',
      url: webhookUrl,
      headers,
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
        headers: allData.headers,
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
      throw new BadRequestException(error);
    }
  }
}
