import axios from 'axios';
import dayjs from 'dayjs';
import { WebhookLogEntity } from '@impler/dal';
import { StatusEnum, ISendDataParameters } from '@impler/shared';

export abstract class BaseConsumer {
  protected DEFAULT_PAGE = 1;
  abstract message(data: any): void;

  getNextPageNumber({
    currentPage,
    chunkSize,
    totalRecords,
  }: {
    currentPage: number;
    totalRecords: number;
    chunkSize;
  }): number | null {
    if (totalRecords > currentPage * chunkSize) {
      return currentPage + this.DEFAULT_PAGE;
    }

    return null;
  }

  getTotalPages(totalRecords: number, pageSize: number): number {
    return Math.ceil(totalRecords / pageSize);
  }

  getNextTime(delayInMinutes: number) {
    return dayjs().add(delayInMinutes, 'minutes');
  }

  async makeApiCall({
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
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const formattedError = error.toJSON() as any;
          baseResponse.error = {
            error: formattedError.message || formattedError,
            data: error.response.data,
          };
          baseResponse.failedReason = 'Application Error';
          baseResponse.responseStatusCode = error.response.status;
        } else if (error.request) {
          baseResponse.error = {
            error: `Cannot connect to ${url}`,
          };
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
