import axios from 'axios';
import {
  FileEncodingsEnum,
  ProcessFileCachedData,
  ProcessFileData,
  StatusEnum,
  UploadStatusEnum,
  QueuesEnum,
  replaceVariablesInObject,
  FileNameService,
} from '@impler/shared';
import { StorageService } from '@impler/shared/dist/services/storage';
import { FileEntity, UploadRepository, WebhookLogEntity, TemplateRepository, WebhookLogRepository } from '@impler/dal';

import { BaseConsumer } from './base.consumer';
import { publishToQueue } from '../bootstrap';
import { getStorageServiceClass } from '../helpers/storage.helper';
import { ISendDataParameters, IBuildSendDataParameters, IGetNextDataParameters } from '../types/file-processing.types';

const MIN_LIMIT = 0;
const DEFAULT_PAGE = 1;

export class ProcessFileConsumer extends BaseConsumer {
  private fileNameService: FileNameService = new FileNameService();
  private templateRepository: TemplateRepository = new TemplateRepository();
  private uploadRepository: UploadRepository = new UploadRepository();
  private webhookLogRepository: WebhookLogRepository = new WebhookLogRepository();
  private storageService: StorageService = getStorageServiceClass();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as ProcessFileData;
    const uploadId = data.uploadId;
    const cachedData = data.cache || (await this.getInitialCachedData(uploadId));

    if (cachedData) {
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
        page: cachedData.page || DEFAULT_PAGE,
        recordFormat: cachedData.recordFormat,
        chunkFormat: cachedData.chunkFormat,
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

      const nextCachedData = this.getNextData({
        allData: allDataJson,
        ...cachedData,
      });

      if (nextCachedData) {
        // Make next call
        publishToQueue(QueuesEnum.PROCESS_FILE, {
          uploadId,
          cache: nextCachedData,
        });
      } else {
        // Processing is done
        this.finalizeUpload(uploadId);
      }
    }
  }

  private async makeApiCall({
    data,
    uploadId,
    page,
    method,
    url,
    headers,
  }: ISendDataParameters): Promise<Partial<WebhookLogEntity>> {
    const baseResponse: Partial<WebhookLogEntity> = {
      _uploadId: uploadId,
      callDate: new Date(),
      pageNumber: page,
      dataContent: data as any,
      headersContent: headers,
    };
    try {
      const response = await axios({
        method,
        url,
        data,
        headers: headers || {},
      });

      baseResponse.responseStatusCode = response.status;
      baseResponse.status = StatusEnum.SUCCEED;

      return baseResponse;
    } catch (error) {
      baseResponse.status = StatusEnum.FAILED;
      if (axios.isAxiosError(error)) {
        if (error.response) {
          baseResponse.error = {
            error: error.toJSON(),
            data: error.response.data,
          };
          baseResponse.failedReason = 'Application Error';
          baseResponse.responseStatusCode = error.response.status;
        } else if (error.request) {
          baseResponse.error = error.toJSON();
          baseResponse.failedReason = 'Network Error';
          baseResponse.responseStatusCode = error.request.status;
        } else {
          baseResponse.failedReason = error.message;
          baseResponse.responseStatusCode = 400;
        }
      } else {
        baseResponse.failedReason = error.message;
        baseResponse.responseStatusCode = 400;
      }

      return baseResponse;
    }
  }

  private buildSendData({
    data,
    page = DEFAULT_PAGE,
    chunkSize,
    template,
    uploadId,
    fileName,
    chunkFormat,
    recordFormat,
    extra = '',
  }: IBuildSendDataParameters): { sendData: Record<string, unknown>; page: number } {
    let slicedData = data.slice(
      Math.max((page - DEFAULT_PAGE) * chunkSize, MIN_LIMIT),
      Math.min(page * chunkSize, data.length)
    );
    if (recordFormat)
      slicedData = slicedData.map((obj) => replaceVariablesInObject(JSON.parse(recordFormat), obj.record));
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

  private getNextData({ allData, page, chunkSize, ...rest }: IGetNextDataParameters): ProcessFileCachedData | null {
    if (Array.isArray(allData) && allData.length >= page * chunkSize) {
      return {
        chunkSize,
        page: page + DEFAULT_PAGE,
        ...rest,
      };
    }

    return null;
  }

  private getTotalPages(totalRecords: number, pageSize: number): number {
    return Math.ceil(totalRecords / pageSize);
  }

  private async getInitialCachedData(_uploadId: string): Promise<ProcessFileCachedData> {
    // Get Upload Information
    const uploadata = await this.uploadRepository.getUploadProcessInformation(_uploadId);
    if (uploadata._allDataFileId) return null;

    // Get template information
    const templateData = await this.templateRepository.findById(
      uploadata._templateId,
      'name _projectId callbackUrl chunkSize code authHeaderName'
    );

    return {
      _templateId: uploadata._templateId,
      callbackUrl: templateData.callbackUrl,
      chunkSize: templateData.chunkSize,
      name: templateData.name,
      page: 1,
      authHeaderName: templateData.authHeaderName,
      authHeaderValue: uploadata.authHeaderValue,
      allDataFilePath: this.fileNameService.getAllJsonDataFilePath(_uploadId),
      fileName: (uploadata._uploadedFileId as unknown as FileEntity)?.originalName,
      extra: uploadata.extra,
      recordFormat: uploadata.customRecordFormat,
      chunkFormat: uploadata.customChunkFormat,
    };
  }

  private async makeResponseEntry(data: Partial<WebhookLogEntity>) {
    return await this.webhookLogRepository.create(data);
  }

  private async finalizeUpload(uploadId: string) {
    return await this.uploadRepository.update({ _id: uploadId }, { status: UploadStatusEnum.COMPLETED });
  }
}
