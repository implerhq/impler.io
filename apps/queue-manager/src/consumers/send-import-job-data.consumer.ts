import {
  ColumnRepository,
  TemplateRepository,
  ImportJobHistoryRepository,
  WebhookDestinationRepository,
  WebhookLogEntity,
  UserJobRepository,
} from '@impler/dal';
import { StorageService } from '@impler/services';
import {
  SendImportJobData,
  SendImportJobCachedData,
  replaceVariablesInObject,
  QueuesEnum,
  ColumnTypesEnum,
  FileEncodingsEnum,
  ColumnDelimiterEnum,
  UserJobImportStatusEnum,
} from '@impler/shared';

import { publishToQueue } from '../bootstrap';
import { BaseConsumer } from './base.consumer';
import { getStorageServiceClass } from '../helpers/services.helper';

const MIN_LIMIT = 0;
const DEFAULT_PAGE = 1;

export class SendImportJobDataConsumer extends BaseConsumer {
  private columnRepository: ColumnRepository = new ColumnRepository();
  public userJobRepository: UserJobRepository = new UserJobRepository();
  private templateRepository: TemplateRepository = new TemplateRepository();
  public importJobHistoryRepository: ImportJobHistoryRepository = new ImportJobHistoryRepository();
  public webhookDestinationRepository: WebhookDestinationRepository = new WebhookDestinationRepository();
  public storageService: StorageService = getStorageServiceClass();

  async message(message: { content: string }) {
    console.log('Auto importing......');
    const data = JSON.parse(message.content) as SendImportJobData;
    const cachedData = data.cache || (await this.getInitialCachedData(data._jobId, data.allDataFilePath));
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
        uploadId: data._jobId,
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
        uploadId: data._jobId,
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
        // Make next call
        publishToQueue(QueuesEnum.SEND_IMPORT_JOB_DATA, {
          _jobId: data._jobId,
          allDataFilePath: data.allDataFilePath,
          cache: {
            ...cachedData,
            page: nextPageNumber,
          },
        } as SendImportJobData);
      } else {
        // Processing is done
        this.finalizeUpload(data._jobId);
      }
    }
  }

  public buildSendData({
    data,
    defaultValues,
    page = DEFAULT_PAGE,
    chunkSize,
    uploadId,
    chunkFormat,
    recordFormat,
    extra = '',
    multiSelectHeadings,
    isInvalidRecords,
  }: SendImportJobCachedData & {
    data: any[];
    uploadId: string;
    isInvalidRecords?: boolean;
  }): {
    sendData: Record<string, unknown>;
    page: number;
  } {
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
      ...(isInvalidRecords !== undefined && { isInvalidRecords }),
    };

    return {
      sendData: chunkFormat ? replaceVariablesInObject(JSON.parse(chunkFormat), sendData as any) : sendData,
      page,
    };
  }

  async getInitialCachedData(_jobId: string, allDataFilePath: string): Promise<SendImportJobCachedData> {
    const userJob = await this.userJobRepository.findById(_jobId);
    const userJobEmail = await this.userJobRepository.getUserEmailFromJobId(_jobId);

    const columns = await this.columnRepository.find({
      _templateId: userJob._templateId,
    });
    const templateData = await this.templateRepository.findById(userJob._templateId, 'name _projectId code');
    const webhookDestination = await this.webhookDestinationRepository.findOne({
      _templateId: userJob._templateId,
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

    return {
      page: 1,
      allDataFilePath,
      email: userJobEmail,
      multiSelectHeadings,
      extra: userJob.extra,
      name: templateData.name,
      projectId: templateData._projectId,
      _templateId: userJob._templateId,
      authHeaderValue: userJob.authHeaderValue,
      callbackUrl: webhookDestination?.callbackUrl,
      chunkSize: webhookDestination?.chunkSize,
      authHeaderName: webhookDestination.authHeaderName,
      defaultValues: JSON.stringify(defaultValueObj),
      recordFormat: userJob.customRecordFormat,
      chunkFormat: userJob.customChunkFormat,
      isInvalidRecords: userJob.isInvalidRecords,
    };
  }

  public async makeResponseEntry(data: Partial<WebhookLogEntity>) {
    return this.importJobHistoryRepository.create(data);
  }

  public async finalizeUpload(_jobId: string) {
    return await this.userJobRepository.update({ _id: _jobId }, { status: UserJobImportStatusEnum.COMPLETED });
  }
}
