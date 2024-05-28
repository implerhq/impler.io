import {
  FileEncodingsEnum,
  SendWebhookCachedData,
  SendWebhookData,
  UploadStatusEnum,
  QueuesEnum,
  replaceVariablesInObject,
  FileNameService,
  ITemplateSchemaItem,
  ColumnTypesEnum,
} from '@impler/shared';
import { StorageService } from '@impler/shared/dist/services/storage';
import {
  FileEntity,
  UploadRepository,
  WebhookLogEntity,
  TemplateRepository,
  WebhookLogRepository,
  WebhookDestinationRepository,
} from '@impler/dal';

import { BaseConsumer } from './base.consumer';
import { publishToQueue } from '../bootstrap';
import { getStorageServiceClass } from '../helpers/storage.helper';
import { IBuildSendDataParameters } from '../types/file-processing.types';

const MIN_LIMIT = 0;
const DEFAULT_PAGE = 1;

export class SendWebhookDataConsumer extends BaseConsumer {
  private fileNameService: FileNameService = new FileNameService();
  private templateRepository: TemplateRepository = new TemplateRepository();
  private uploadRepository: UploadRepository = new UploadRepository();
  private webhookLogRepository: WebhookLogRepository = new WebhookLogRepository();
  private webhookDestinationRepository: WebhookDestinationRepository = new WebhookDestinationRepository();
  private storageService: StorageService = getStorageServiceClass();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as SendWebhookData;
    const uploadId = data.uploadId;
    const cachedData = data.cache || (await this.getInitialCachedData(uploadId));

    if (cachedData && cachedData.callbackUrl) {
      // Get valid data information
      let allDataJson: null | any[] = null;
      if (cachedData.allDataFilePath) {
        const allDataContent = await this.storageService.getFileContent(
          cachedData.allDataFilePath,
          FileEncodingsEnum.JSON
        );
        allDataJson = JSON.parse(allDataContent);
      }
      if (!(Array.isArray(allDataJson) && allDataJson.length > 0)) return;
      const { sendData, page } = this.buildSendData({
        uploadId,
        data: allDataJson,
        extra: cachedData.extra,
        template: cachedData.name,
        fileName: cachedData.fileName,
        chunkSize: cachedData.chunkSize,
        defaultValues: cachedData.defaultValues,
        page: cachedData.page || DEFAULT_PAGE,
        recordFormat: cachedData.recordFormat,
        chunkFormat: cachedData.chunkFormat,
        totalRecords: allDataJson.length,
        multiSelectHeadings: cachedData.multiSelectHeadings,
      });

      const headers =
        cachedData.authHeaderName && cachedData.authHeaderValue
          ? { [cachedData.authHeaderName]: cachedData.authHeaderValue }
          : null;

      const response = await this.makeApiCall({
        data: sendData,
        uploadId,
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
        publishToQueue(QueuesEnum.SEND_WEBHOOK_DATA, {
          uploadId,
          cache: {
            ...cachedData,
            page: nextPageNumber,
          },
        });
      } else {
        // Processing is done
        this.finalizeUpload(uploadId);
      }
    }
  }

  private buildSendData({
    data,
    defaultValues,
    page = DEFAULT_PAGE,
    chunkSize,
    template,
    uploadId,
    fileName,
    chunkFormat,
    recordFormat,
    extra = '',
    multiSelectHeadings,
  }: IBuildSendDataParameters): { sendData: Record<string, unknown>; page: number } {
    const defaultValuesObj = JSON.parse(defaultValues);
    let slicedData = data.slice(
      Math.max((page - DEFAULT_PAGE) * chunkSize, MIN_LIMIT),
      Math.min(page * chunkSize, data.length)
    );
    if (Array.isArray(multiSelectHeadings) && multiSelectHeadings.length > 0) {
      slicedData = slicedData.map((obj) => {
        multiSelectHeadings.forEach((heading) => {
          obj.record[heading] = obj.record[heading] ? obj.record[heading].split(',') : [];
        });

        return obj;
      });
    }
    if (recordFormat)
      slicedData = slicedData.map((obj) =>
        replaceVariablesInObject(JSON.parse(recordFormat), obj.record, defaultValuesObj)
      );
    else slicedData = slicedData.map((obj) => obj.record);

    const sendData = {
      page,
      fileName,
      template,
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

  private async getInitialCachedData(_uploadId: string): Promise<SendWebhookCachedData> {
    // Get Upload Information
    const uploadata = await this.uploadRepository.getUploadProcessInformation(_uploadId);
    if (uploadata._allDataFileId) return null;

    // Get template information
    const templateData = await this.templateRepository.findById(uploadata._templateId, 'name _projectId code');

    const webhookDestination = await this.webhookDestinationRepository.findOne({ _templateId: uploadata._templateId });

    const defaultValueObj = {};
    const multiSelectHeadings = [];
    const customSchema = JSON.parse(uploadata.customSchema) as ITemplateSchemaItem[];
    if (Array.isArray(customSchema)) {
      customSchema.forEach((item: ITemplateSchemaItem) => {
        if (item.defaultValue) defaultValueObj[item.key] = item.defaultValue;
        if (item.type === ColumnTypesEnum.SELECT && item.allowMultiSelect) multiSelectHeadings.push(item.key);
      });
    }

    return {
      _templateId: uploadata._templateId,
      callbackUrl: webhookDestination?.callbackUrl,
      chunkSize: webhookDestination?.chunkSize,
      name: templateData.name,
      page: 1,
      authHeaderName: webhookDestination?.authHeaderName,
      authHeaderValue: uploadata.authHeaderValue,
      allDataFilePath: this.fileNameService.getAllJsonDataFilePath(_uploadId),
      fileName: (uploadata._uploadedFileId as unknown as FileEntity)?.originalName,
      extra: uploadata.extra,
      defaultValues: JSON.stringify(defaultValueObj),
      recordFormat: uploadata.customRecordFormat,
      chunkFormat: uploadata.customChunkFormat,
      multiSelectHeadings,
    };
  }

  private async makeResponseEntry(data: Partial<WebhookLogEntity>) {
    return await this.webhookLogRepository.create(data);
  }

  private async finalizeUpload(uploadId: string) {
    return await this.uploadRepository.update({ _id: uploadId }, { status: UploadStatusEnum.COMPLETED });
  }
}
