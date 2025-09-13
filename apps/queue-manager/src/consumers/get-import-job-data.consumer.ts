import { RSSXMLService } from '@impler/services';
import {
  ImportJobHistoryStatusEnum,
  SendImportJobCachedData,
  ColumnTypesEnum,
  ITemplateSchemaItem,
  ColumnDelimiterEnum,
} from '@impler/shared';

import { SendImportJobDataConsumer } from './send-import-job-data.consumer';
import { CommonRepository, JobMappingRepository, ColumnRepository } from '@impler/dal';

export class GetImportJobDataConsumer extends SendImportJobDataConsumer {
  private commonRepository: CommonRepository = new CommonRepository();
  private jobMappingRepository: JobMappingRepository = new JobMappingRepository();
  private columnRepo: ColumnRepository = new ColumnRepository();
  private rssXmlService: RSSXMLService = new RSSXMLService();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as { _jobId: string };
    const importJobHistoryId = this.commonRepository.generateMongoId().toString();
    const validationResult = await this.getJobImportedData(data._jobId);

    // Create history entry
    await this.importJobHistoryRepository.create({
      _id: importJobHistoryId,
      _jobId: data._jobId,
      status: ImportJobHistoryStatusEnum.PROCESSING,
    });

    const userJobInfo = await this.userJobRepository.getUserJobWithTemplate(data._jobId);
    const webhookDestination = await this.webhookDestinationRepository.findOne({
      _templateId: userJobInfo._templateId,
    });

    if (webhookDestination?.callbackUrl) {
      if (validationResult.validRecords > 0) {
        await this.sendDataImportData(data._jobId, validationResult.validData, 1, undefined, false);
      }
      if (validationResult.invalidRecords > 0) {
        await this.sendDataImportData(data._jobId, validationResult.invalidData, 1, undefined, true);
      }
    }

    return;
  }

  async getJobImportedData(_jobId: string): Promise<{
    importedData: Record<string, unknown>[];
    hasInvalidRecords: boolean;
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    validData: Record<string, unknown>[];
    invalidData: Record<string, unknown>[];
  }> {
    try {
      const userJob = await this.userJobRepository.findOne({ _id: _jobId });
      if (!userJob) {
        throw new Error(`Job not found for _jobId: ${_jobId}`);
      }

      const jobMappings = await this.jobMappingRepository.find({ _jobId });
      const mappings: { key: string; path: string }[] = jobMappings.map((jobMapping) => ({
        key: jobMapping.key,
        path: jobMapping.path,
      }));

      const parsedXMLData = await this.rssXmlService.parseXMLAndExtractData({
        xmlUrl: userJob.url,
      });
      if (!parsedXMLData) {
        throw new Error('Failed to parse XML data');
      }

      const batchResult = await this.rssXmlService.getBatchXMLKeyValuesByPaths(parsedXMLData.xmlData, mappings);
      const mappedData = await this.rssXmlService.mappingFunction(mappings, batchResult);

      const validationResult = await this.validateData(_jobId, mappedData);

      // Send data to webhook with validation status
      this.sendDataImportData(_jobId, mappedData, 1, undefined, validationResult.hasInvalidRecords);

      if (validationResult.hasInvalidRecords) {
        await this.userJobRepository.update({ _id: _jobId }, { $set: { isInvalidRecords: true } });
      }

      return {
        importedData: mappedData,
        hasInvalidRecords: validationResult.hasInvalidRecords,
        totalRecords: validationResult.totalRecords,
        validRecords: validationResult.validRecords,
        invalidRecords: validationResult.invalidRecords,
        validData: validationResult.validData,
        invalidData: validationResult.invalidData,
      };
    } catch (error) {}
  }

  private async validateData(
    _jobId: string,
    mappedData: Record<string, unknown>[]
  ): Promise<{
    hasInvalidRecords: boolean;
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    validData: Record<string, unknown>[];
    invalidData: Record<string, unknown>[];
  }> {
    try {
      const userJob = await this.userJobRepository.findOne({ _id: _jobId });
      if (!userJob) {
        throw new Error(`Job not found for _jobId: ${_jobId}`);
      }

      // Get template columns (schema)
      const columns = await this.columnRepo.find({ _templateId: userJob._templateId });
      if (!columns || columns.length === 0) {
        return {
          hasInvalidRecords: false,
          totalRecords: 0,
          validRecords: 0,
          invalidRecords: 0,
          validData: [],
          invalidData: [],
        };
      }

      const multiSelectColumnHeadings: Record<string, string> = {};

      (columns as unknown as ITemplateSchemaItem[]).forEach((column) => {
        if (column.type === ColumnTypesEnum.SELECT && column.allowMultiSelect)
          multiSelectColumnHeadings[column.key] = column.delimiter || ColumnDelimiterEnum.COMMA;
      });

      let totalRecords = 0;
      let validRecords = 0;
      let invalidRecords = 0;
      const validData: Record<string, unknown>[] = [];
      const invalidData: Record<string, unknown>[] = [];

      for (const recordData of mappedData) {
        // Format record for multi-select handling
        const checkRecord: Record<string, unknown> = this.formatRecord({
          record: { record: recordData },
          multiSelectColumnHeadings,
        });

        const validationResult = this.validateRecordUsingColumnSchema(
          checkRecord,
          columns as unknown as ITemplateSchemaItem[]
        );

        totalRecords++;

        if (validationResult.isValid) {
          validRecords++;
          validData.push(recordData);
        } else {
          invalidRecords++;
          invalidData.push(recordData);
        }
      }

      const hasInvalidRecords = invalidRecords > 0;

      return {
        hasInvalidRecords,
        totalRecords,
        validRecords,
        invalidRecords,
        validData,
        invalidData,
      };
    } catch (error) {
      return {
        hasInvalidRecords: false,
        totalRecords: 0,
        validRecords: 0,
        invalidRecords: 0,
        validData: [],
        invalidData: [],
      };
    }
  }

  private formatRecord({
    record,
    multiSelectColumnHeadings,
  }: {
    record: { record: Record<string, unknown> };
    multiSelectColumnHeadings?: Record<string, string>;
  }) {
    return Object.keys(multiSelectColumnHeadings || {}).reduce(
      (acc, heading) => {
        if (typeof record.record[heading] === 'string') {
          acc[heading] = (record.record[heading] as string)?.split(multiSelectColumnHeadings[heading]);
        }

        return acc;
      },
      { ...record.record }
    );
  }

  private async sendDataImportData(
    _jobId: string,
    allDataJson: Record<string, any>[],
    page = 1,
    initialCachedData?: SendImportJobCachedData,
    areInvalidRecords?: boolean
  ) {
    try {
      let cachedData = null;
      if (!initialCachedData) {
        cachedData = await this.getInitialCachedData(_jobId, null);
      } else {
        cachedData = initialCachedData;
      }

      if (cachedData && cachedData.callbackUrl) {
        const { sendData } = this.buildSendData({
          data: allDataJson,
          uploadId: _jobId,
          page,
          chunkSize: cachedData.chunkSize,
          recordFormat: cachedData.recordFormat,
          chunkFormat: cachedData.chunkFormat,
          ...cachedData,
          isInvalidRecords: areInvalidRecords,
        });

        const headers =
          cachedData.authHeaderName && cachedData.authHeaderValue
            ? { [cachedData.authHeaderName]: cachedData.authHeaderValue }
            : null;

        const response = await this.makeApiCall({
          data: sendData,
          uploadId: _jobId,
          page,
          method: 'POST',
          url: cachedData.callbackUrl,
          headers,
        });

        await this.makeResponseEntry(response);

        const nextPageNumber = this.getNextPageNumber({
          totalRecords: allDataJson.length,
          currentPage: page,
          chunkSize: cachedData.chunkSize,
        });

        if (nextPageNumber) {
          await this.sendDataImportData(_jobId, allDataJson, nextPageNumber, { ...cachedData, page: nextPageNumber });
        } else {
          await this.finalizeUpload(_jobId);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private validateRecordUsingColumnSchema(
    record: Record<string, unknown>,
    columns: ITemplateSchemaItem[]
  ): { isValid: boolean; errors: Record<string, string> } {
    enum ValidationTypesEnum {
      RANGE = 'range',
      LENGTH = 'length',
      UNIQUE_WITH = 'unique_with',
      DIGITS = 'digits',
    }
    const errors: Record<string, string> = {};
    let isValid = true;

    for (const column of columns) {
      const value = record[column.key];

      if (value === undefined && column.isRequired) {
        errors[column.key] = `${column.key} is required but has undefined value`;
        isValid = false;
        continue;
      }

      if (value === undefined && !column.isRequired) {
        continue;
      }

      if (column.isRequired && (value === null || value === '' || !value)) {
        errors[column.key] = `${column.key} is required`;
        isValid = false;
        continue;
      }

      if (value !== null && value !== '') {
        switch (column.type) {
          case ColumnTypesEnum.NUMBER:
            if (isNaN(Number(value))) {
              errors[column.key] = `${column.key} must be a valid number`;
              isValid = false;
            }
            break;
          case ColumnTypesEnum.DOUBLE:
            if (isNaN(Number(value)) || !Number.isFinite(Number(value))) {
              errors[column.key] = `${column.key} must be a valid decimal number`;
              isValid = false;
            }
            break;
          case ColumnTypesEnum.EMAIL:
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(String(value))) {
              errors[column.key] = `${column.key} must be a valid email address`;
              isValid = false;
            }
            break;
          case ColumnTypesEnum.DATE:
            if (isNaN(Date.parse(String(value)))) {
              errors[column.key] = `${column.key} must be a valid date`;
              isValid = false;
            }
            break;
          case ColumnTypesEnum.REGEX:
            if (column.regex && !new RegExp(column.regex).test(String(value))) {
              errors[column.key] = `${column.key} does not match required format`;
              isValid = false;
            }
            break;
          case ColumnTypesEnum.SELECT:
            if (column.selectValues && !column.selectValues.includes(String(value))) {
              errors[column.key] = `${column.key} must be one of: ${column.selectValues.join(', ')}`;
              isValid = false;
            }
            break;
          case ColumnTypesEnum.IMAGE:
            const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
            if (!imageUrlRegex.test(String(value))) {
              errors[column.key] = `${column.key} must be a valid image URL`;
              isValid = false;
            }
            break;
        }
      }

      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        column.validations &&
        column.validations.length > 0
      ) {
        for (const validation of column.validations) {
          switch (validation.validate) {
            case ValidationTypesEnum.RANGE:
              const numValue = Number(value);
              if (!isNaN(numValue)) {
                if (validation.min !== undefined && numValue < validation.min) {
                  errors[column.key] = `${column.key} must be at least ${validation.min}`;
                  isValid = false;
                }
                if (validation.max !== undefined && numValue > validation.max) {
                  errors[column.key] = `${column.key} must be at most ${validation.max}`;
                  isValid = false;
                }
              }
              break;
            case ValidationTypesEnum.LENGTH:
              const strValue = String(value);
              if (validation.min !== undefined && strValue.length < validation.min) {
                errors[column.key] = `${column.key} must be at least ${validation.min} characters long`;
                isValid = false;
              }
              if (validation.max !== undefined && strValue.length > validation.max) {
                errors[column.key] = `${column.key} must be at most ${validation.max} characters long`;
                isValid = false;
              }
              break;
            case ValidationTypesEnum.DIGITS:
              const digitStr = String(value).replace(/[^0-9]/g, '');
              if (validation.min !== undefined && digitStr.length < validation.min) {
                errors[column.key] = `${column.key} must have at least ${validation.min} digits`;
                isValid = false;
              }
              if (validation.max !== undefined && digitStr.length > validation.max) {
                errors[column.key] = `${column.key} must have at most ${validation.max} digits`;
                isValid = false;
              }
              break;
            case ValidationTypesEnum.UNIQUE_WITH:
              break;
          }
          if (!isValid) break;
        }
      }
    }

    return { isValid, errors };
  }
}
