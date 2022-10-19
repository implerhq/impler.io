import axios from 'axios';
import { FileEncodingsEnum, ProcessFileCachedData, ProcessFileData, StorageService } from '@impler/shared';
import { FileEntity, UploadRepository, TemplateRepository } from '@impler/dal';
import { BaseConsumer } from './base.consumer';
import { getStorageServiceClass } from '../helpers/storage.helper';
import {
  ISendDataParameters,
  IBuildSendDataParameters,
  IGetNextDataParameters,
  ISendDataResponse,
  ISendData,
} from '../types/file-processing.types';

export class ProcessFileConsumer extends BaseConsumer {
  private templateRepository: TemplateRepository = new TemplateRepository();
  private uploadRepository: UploadRepository = new UploadRepository();
  private storageService: StorageService = getStorageServiceClass();

  async message(message) {
    const data = JSON.parse(message.content) as ProcessFileData;
    const uploadId = data.uploadId;
    const cachedData = data.cache || (await this.getInitialCachedData(uploadId));

    if (cachedData) {
      // Get valid data information
      const validDataContent = await this.storageService.getFileContent(
        cachedData.validDataFilePath,
        FileEncodingsEnum.JSON
      );
      const validDataJSON: any[] = JSON.parse(validDataContent);

      // Get invalid data information
      let invalidDataJSON: null | any[] = null;
      if (cachedData.processInvalidRecords) {
        const invalidDataContent = await this.storageService.getFileContent(
          cachedData.invalidDataFilePath,
          FileEncodingsEnum.JSON
        );
        invalidDataJSON = JSON.parse(invalidDataContent);
      }

      const sendData = this.buildSendData({
        chunkSize: cachedData.chunkSize,
        data: cachedData.isInvalidRecords ? invalidDataJSON : validDataJSON,
        page: cachedData.page || 1,
        isInvalidRecords: cachedData.isInvalidRecords,
        template: cachedData.code,
        uploadId,
        extra: cachedData.extra,
      });

      const response = await this.makeApiCall({ data: sendData, method: 'POST', url: cachedData.callbackUrl });
      this.makeResponseEntry(response);

      const nextCachedData = this.getNextData({
        validData: validDataJSON,
        invalidData: invalidDataJSON,
        ...cachedData,
      });

      if (nextCachedData) {
        this.message({
          content: JSON.stringify({
            uploadId,
            cache: nextCachedData,
          }),
        });
      }
    }
  }

  private async makeApiCall({ data, method, url }: ISendDataParameters): Promise<ISendDataResponse> {
    try {
      const response = await axios({
        method,
        url,
        data,
      });

      return {
        statusCode: response.status,
        status: 'SUCCEED',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return {
            statusCode: error.response.status,
            status: 'FAILED',
            failedReason: 'Application Error',
          };
        } else if (error.request) {
          return {
            statusCode: error.request.status,
            status: 'FAILED',
            failedReason: 'Network Error',
          };
        } else {
          return {
            statusCode: 400,
            status: 'FAILED',
            failedReason: error.message,
          };
        }
      } else {
        return {
          statusCode: 400,
          status: 'FAILED',
          failedReason: error.message,
        };
      }
    }
  }

  private buildSendData({
    data,
    page = 1,
    chunkSize,
    isInvalidRecords,
    template,
    uploadId,
    extra = '',
  }: IBuildSendDataParameters): ISendData {
    const slicedData = data.slice(Math.max((page - 1) * chunkSize, 0), Math.min((page + 1) * chunkSize, data.length));

    return {
      data: slicedData,
      extra: extra ? JSON.parse(extra) : '',
      isInvalidRecords,
      page,
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
      page: page + 1,
      isInvalidRecords: isInvalidRecords || false,
      ...rest,
    };
    if (!isInvalidRecords && Array.isArray(validData) && validData.length > page * chunkSize) {
      // there is more valid data available to send on next page
      return {
        ...baseData,
        page: page + 1,
        isInvalidRecords: false,
      };
    } else if (!isInvalidRecords && Array.isArray(invalidData) && invalidData.length > 0) {
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
        page: page + 1,
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
    const templateData = await this.templateRepository.findById(uploadata._templateId, 'callbackUrl chunkSize code');

    return {
      _templateId: uploadata._templateId,
      callbackUrl: templateData.callbackUrl,
      chunkSize: templateData.chunkSize,
      code: templateData.code,
      isInvalidRecords: uploadata._validDataFileId ? false : true,
      invalidDataFilePath: (uploadata._invalidDataFileId as unknown as FileEntity).path,
      page: 1,
      processInvalidRecords: uploadata.processInvalidRecords,
      validDataFilePath: (uploadata._validDataFileId as unknown as FileEntity).path,
      extra: uploadata.extra,
    };
  }

  private async makeResponseEntry(data: ISendDataResponse) {
    console.log(data);
  }
}
