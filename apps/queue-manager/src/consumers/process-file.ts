import axios from 'axios';
import {
  FileEncodingsEnum,
  ProcessFileCachedData,
  ProcessFileData,
  StatusEnum,
  UploadStatusEnum,
  QueuesEnum,
} from '@impler/shared';
import { StorageService } from '@impler/shared/dist/services/storage';
import {
  FileEntity,
  UploadRepository,
  TemplateRepository,
  WebhookLogRepository,
  WebhookLogEntity,
  ProjectRepository,
} from '@impler/dal';
import { BaseConsumer } from './base.consumer';
import { getStorageServiceClass } from '../helpers/storage.helper';
import { publishToQueue } from '../bootstrap';
import {
  ISendDataParameters,
  IBuildSendDataParameters,
  IGetNextDataParameters,
  ISendData,
} from '../types/file-processing.types';

const MIN_LIMIT = 0;
const DEFAULT_PAGE = 1;

export class ProcessFileConsumer extends BaseConsumer {
  private templateRepository: TemplateRepository = new TemplateRepository();
  private uploadRepository: UploadRepository = new UploadRepository();
  private projectRepository: ProjectRepository = new ProjectRepository();
  private webhookLogRepository: WebhookLogRepository = new WebhookLogRepository();
  private storageService: StorageService = getStorageServiceClass();

  async message(message) {
    const data = JSON.parse(message.content) as ProcessFileData;
    const uploadId = data.uploadId;
    const cachedData = data.cache || (await this.getInitialCachedData(uploadId));

    if (cachedData) {
      // Get valid data information
      let validDataJSON: null | any[] = null;
      if (cachedData.validDataFilePath) {
        const validDataContent = await this.storageService.getFileContent(
          cachedData.validDataFilePath,
          FileEncodingsEnum.JSON
        );
        validDataJSON = JSON.parse(validDataContent);
      }

      // Get invalid data information
      let invalidDataJSON: null | any[] = null;
      if (cachedData.processInvalidRecords && cachedData.invalidDataFilePath) {
        const invalidDataContent = await this.storageService.getFileContent(
          cachedData.invalidDataFilePath,
          FileEncodingsEnum.JSON
        );
        invalidDataJSON = JSON.parse(invalidDataContent);
      }

      const sendData = this.buildSendData({
        chunkSize: cachedData.chunkSize,
        data: cachedData.isInvalidRecords ? invalidDataJSON : validDataJSON,
        page: cachedData.page || DEFAULT_PAGE,
        isInvalidRecords: cachedData.isInvalidRecords,
        template: cachedData.code,
        fileName: cachedData.fileName,
        uploadId,
        extra: cachedData.extra,
      });

      const headers =
        cachedData.authHeaderName && cachedData.authHeaderValue
          ? { [cachedData.authHeaderName]: cachedData.authHeaderValue }
          : null;

      const response = await this.makeApiCall({ data: sendData, method: 'POST', url: cachedData.callbackUrl, headers });
      this.makeResponseEntry(response);

      const nextCachedData = this.getNextData({
        validData: validDataJSON,
        invalidData: invalidDataJSON,
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

  private async makeApiCall({ data, method, url, headers }: ISendDataParameters): Promise<Partial<WebhookLogEntity>> {
    const baseResponse: Partial<WebhookLogEntity> = {
      _uploadId: data.uploadId,
      callDate: new Date(),
      pageNumber: data.page,
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
          baseResponse.failedReason = 'Application Error';
          baseResponse.responseStatusCode = error.response.status;
        } else if (error.request) {
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
    isInvalidRecords,
    template,
    uploadId,
    fileName,
    extra = '',
  }: IBuildSendDataParameters): ISendData {
    const slicedData = data.slice(
      Math.max((page - DEFAULT_PAGE) * chunkSize, MIN_LIMIT),
      Math.min((page + DEFAULT_PAGE) * chunkSize, data.length)
    );

    return {
      data: slicedData,
      extra: extra ? JSON.parse(extra) : '',
      isInvalidRecords,
      page,
      fileName,
      pageSize: slicedData.length,
      template,
      totalPages: this.getTotalPages(data.length, chunkSize),
      totalRecords: data.length,
      uploadId,
    };
  }

  private getNextData({
    validData,
    page,
    chunkSize,
    invalidData,
    isInvalidRecords,
    ...rest
  }: IGetNextDataParameters): ProcessFileCachedData | null {
    const baseData = {
      chunkSize,
      page: page + DEFAULT_PAGE,
      isInvalidRecords: isInvalidRecords || false,
      ...rest,
    };
    if (!isInvalidRecords && Array.isArray(validData) && validData.length > page * chunkSize) {
      // there is more valid data available to send on next page
      return {
        ...baseData,
        page: page + DEFAULT_PAGE,
        isInvalidRecords: false,
      };
    } else if (!isInvalidRecords && Array.isArray(invalidData) && invalidData.length > MIN_LIMIT) {
      // valid data are completed, invalid-data is available, so now move to invalid data
      return {
        ...baseData,
        page: 1,
        isInvalidRecords: true,
      };
    } else if (isInvalidRecords && Array.isArray(invalidData) && invalidData.length > page * chunkSize) {
      // currently processing invalid data, and there is more invalid data available to send
      return {
        ...baseData,
        page: page + DEFAULT_PAGE,
        isInvalidRecords: true,
      };
    }

    return null;
  }

  private getTotalPages(totalRecords, pageSize): number {
    return Math.ceil(totalRecords / pageSize);
  }

  private async getInitialCachedData(_uploadId: string): Promise<ProcessFileCachedData> {
    // Get Upload Information
    const uploadata = await this.uploadRepository.getUploadProcessInformation(_uploadId);

    if (!uploadata._validDataFileId && !uploadata._invalidDataFileId) return null;

    // Get template information
    const templateData = await this.templateRepository.findById(
      uploadata._templateId,
      '_projectId callbackUrl chunkSize code'
    );
    const projectData = await this.projectRepository.findById(templateData._projectId, 'authHeaderName');

    return {
      _templateId: uploadata._templateId,
      callbackUrl: templateData.callbackUrl,
      chunkSize: templateData.chunkSize,
      code: templateData.code,
      isInvalidRecords: uploadata._validDataFileId ? false : true,
      invalidDataFilePath: (uploadata._invalidDataFileId as unknown as FileEntity)?.path,
      page: 1,
      authHeaderName: projectData.authHeaderName,
      authHeaderValue: uploadata.authHeaderValue,
      processInvalidRecords: uploadata.processInvalidRecords,
      validDataFilePath: (uploadata._validDataFileId as unknown as FileEntity)?.path,
      fileName: (uploadata._uploadedFileId as unknown as FileEntity)?.originalName,
      extra: uploadata.extra,
    };
  }

  private async makeResponseEntry(data: Partial<WebhookLogEntity>) {
    return await this.webhookLogRepository.create(data);
  }

  private async finalizeUpload(uploadId: string) {
    return await this.uploadRepository.update({ _id: uploadId }, { status: UploadStatusEnum.COMPLETED });
  }
}
