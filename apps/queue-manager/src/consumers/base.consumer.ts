import axios from 'axios';
import { WebhookLogEntity } from '@impler/dal';
import { SendWebhookCachedData, StatusEnum } from '@impler/shared';
import { IGetNextDataParameters, ISendDataParameters } from '../types/file-processing.types';

export abstract class BaseConsumer {
  protected DEFAULT_PAGE = 1;
  abstract message(data: any): void;

  protected getNextData({ allData, page, chunkSize, ...rest }: IGetNextDataParameters): SendWebhookCachedData | null {
    if (Array.isArray(allData) && allData.length >= page * chunkSize) {
      return {
        chunkSize,
        page: page + this.DEFAULT_PAGE,
        ...rest,
      };
    }

    return null;
  }

  protected getTotalPages(totalRecords: number, pageSize: number): number {
    return Math.ceil(totalRecords / pageSize);
  }

  protected async makeApiCall({
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
}
