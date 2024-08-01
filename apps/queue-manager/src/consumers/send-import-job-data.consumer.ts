import {
  TemplateRepository,
  WebhookDestinationRepository,
  ColumnRepository,
  ImportJobHistoryRepository,
  UserJobEntity,
  WebhookLogEntity,
  UploadRepository,
  WebhookLogRepository,
  UserJobRepository,
} from '@impler/dal';
import { StorageService } from '@impler/services';
import {
  ColumnTypesEnum,
  SendImportJobData,
  SendImportJobCachedData,
  replaceVariablesInObject,
  FileEncodingsEnum,
  QueuesEnum,
  UploadStatusEnum,
  ColumnDelimiterEnum,
} from '@impler/shared';

import { publishToQueue } from '../bootstrap';
import { BaseConsumer } from './base.consumer';
import { getStorageServiceClass } from '../helpers/serivces.helper';

const MIN_LIMIT = 0;
const DEFAULT_PAGE = 1;

export class SendImportJobDataConsumer extends BaseConsumer {
  private columnRepository: ColumnRepository = new ColumnRepository();
  private uploadRepository: UploadRepository = new UploadRepository();
  private userJobRepository: UserJobRepository = new UserJobRepository();
  private templateRepository: TemplateRepository = new TemplateRepository();
  private webhookLogRepository: WebhookLogRepository = new WebhookLogRepository();
  private importJobHistoryRepository: ImportJobHistoryRepository = new ImportJobHistoryRepository();
  private webhookDestinationRepository: WebhookDestinationRepository = new WebhookDestinationRepository();
  private storageService: StorageService = getStorageServiceClass();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as SendImportJobData;
    const cachedData = data.cache || (await this.getInitialCachedData(data.importJobHistoryId));
    let allDataJson: null | any[] = null;

    if (cachedData && cachedData.callbackUrl) {
      if (cachedData.allDataFilePath) {
        const allDataContent = await this.storageService.getFileContent(
          cachedData.allDataFilePath,
          FileEncodingsEnum.JSON
        );
        allDataJson = JSON.parse(allDataContent);
      }
      const { sendData, page } = this.buildSendData({
        data: allDataJson,
        uploadId: data.importJobHistoryId,
        chunkSize: cachedData.chunkSize,
        recordFormat: cachedData.recordFormat,
        chunkFormat: cachedData.chunkFormat,
        ...cachedData,
      });

      const headers =
        cachedData.authHeaderName && cachedData.authHeaderValue
          ? { [cachedData.authHeaderName]: cachedData.authHeaderValue }
          : null;

      const response = await this.makeApiCall({
        data: sendData,
        uploadId: data.importJobHistoryId,
        page,
        method: 'POST',
        url: cachedData.callbackUrl,
        headers,
      });

      this.makeResponseEntry(response);

      const nextPageNumber = this.getNextPageNumber({
        totalRecords: allDataJson.length,
        currentPage: page,
        chunkSize: cachedData.chunkSize,
      });

      if (nextPageNumber) {
        // Make next call
        publishToQueue(QueuesEnum.SEND_IMPORT_JOB_DATA, {
          importJobHistoryId: data.importJobHistoryId,
          cache: {
            ...cachedData,
            page: nextPageNumber,
          },
        });
      } else {
        // Processing is done
        this.finalizeUpload(data.importJobHistoryId);
      }
    }
  }

  private buildSendData({
    data,
    defaultValues,
    page = DEFAULT_PAGE,
    chunkSize,
    uploadId,
    chunkFormat,
    recordFormat,
    extra = '',
    multiSelectHeadings,
  }: SendImportJobCachedData & { data: any[]; uploadId: string }): { sendData: Record<string, unknown>; page: number } {
    const defaultValuesObj = JSON.parse(defaultValues);
    let slicedData = data.slice(
      Math.max((page - DEFAULT_PAGE) * chunkSize, MIN_LIMIT),
      Math.min(page * chunkSize, data.length)
    );

    if (Array.isArray(multiSelectHeadings) && multiSelectHeadings.length > 0) {
      slicedData = slicedData.map((obj) => {
        multiSelectHeadings.forEach((heading) => {
          obj[heading] = obj[heading] ? (Array.isArray(obj[heading]) ? obj[heading] : obj[heading].split(',')) : [];
        });

        return obj;
      });
    }

    if (recordFormat)
      slicedData = slicedData.map((obj) => replaceVariablesInObject(JSON.parse(recordFormat), obj, defaultValuesObj));

    const sendData = {
      page,
      uploadId,
      data: slicedData,
      totalRecords: data.length,
      chunkSize: slicedData.length,
      extra: extra ? JSON.parse(extra) : '',
      totalPages: this.getTotalPages(data.length, chunkSize),
    };

    return {
      sendData: chunkFormat ? replaceVariablesInObject(JSON.parse(chunkFormat), sendData as any) : sendData,
      page,
    };
  }

  private async getInitialCachedData(_importJobHistoryId: string): Promise<SendImportJobCachedData> {
    const importJobHistory = await this.importJobHistoryRepository.getHistoryWithJob(_importJobHistoryId, [
      '_templateId',
    ]);
    const userJobEmail = await this.userJobRepository.getUserEmailFromJobId(importJobHistory._jobId);

    const columns = await this.columnRepository.find({
      _templateId: (importJobHistory._jobId as unknown as UserJobEntity)._templateId,
    });
    const templateData = await this.templateRepository.findById(
      (importJobHistory._jobId as unknown as UserJobEntity)._templateId,
      'name _projectId code'
    );
    const webhookDestination = await this.webhookDestinationRepository.findOne({
      _templateId: (importJobHistory._jobId as unknown as UserJobEntity)._templateId,
    });

    if (!webhookDestination || !webhookDestination.callbackUrl) {
      return null;
    }

    const defaultValueObj = {};
    const multiSelectHeadings = {};
    if (Array.isArray(columns)) {
      columns.forEach((item) => {
        if (item.defaultValue) defaultValueObj[item.key] = item.defaultValue;
        if (item.type === ColumnTypesEnum.SELECT && item.allowMultiSelect)
          multiSelectHeadings[item.key] = item.delimiter || ColumnDelimiterEnum.COMMA;
      });
    }

    this.importJobHistoryRepository.create({
      _jobId: importJobHistory._id,
    });

    return {
      email: userJobEmail,
      _templateId: (importJobHistory._jobId as unknown as UserJobEntity)._templateId,
      callbackUrl: webhookDestination?.callbackUrl,
      chunkSize: webhookDestination?.chunkSize,
      name: templateData.name,
      page: 1,
      extra: (importJobHistory._jobId as unknown as UserJobEntity).extra,
      authHeaderName: webhookDestination.authHeaderName,
      authHeaderValue: '',
      allDataFilePath: importJobHistory.allDataFilePath,
      defaultValues: JSON.stringify(defaultValueObj),
      recordFormat: (importJobHistory._jobId as unknown as UserJobEntity).customRecordFormat,
      chunkFormat: (importJobHistory._jobId as unknown as UserJobEntity).customChunkFormat,
      multiSelectHeadings,
    };
  }

  private async makeResponseEntry(data: Partial<WebhookLogEntity>) {
    return await this.webhookLogRepository.create(data);
  }

  private async finalizeUpload(importJobHistoryId: string) {
    return await this.uploadRepository.update({ _id: importJobHistoryId }, { status: UploadStatusEnum.COMPLETED });
  }
}
