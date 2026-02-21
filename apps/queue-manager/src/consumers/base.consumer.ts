import axios from 'axios';
import dayjs from 'dayjs';
import { WebhookLogEntity } from '@impler/dal';
import { StatusEnum, ISendDataParameters, isUrlSafeForServerRequest } from '@impler/shared';

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
    isRetry,
  }: ISendDataParameters): Promise<Partial<WebhookLogEntity>> {
    const baseResponse: Partial<WebhookLogEntity> = {
      _uploadId: uploadId,
      callDate: new Date(),
      pageNumber: page,
      dataContent: data as any,
      headersContent: headers,
      isRetry: isRetry || false,
    };

    // SSRF protection: validate URL before making the call
    if (!isUrlSafeForServerRequest(url)) {
      baseResponse.status = StatusEnum.FAILED;
      baseResponse.failedReason = 'URL points to a restricted address';
      baseResponse.responseStatusCode = 400;
      baseResponse.error = {
        error: `Blocked request to restricted URL`,
      };

      return baseResponse;
    }

    try {
      const response = await axios({
        method,
        url,
        data,
        headers: headers || {},
        maxRedirects: 5,
        timeout: 30000,
      });

      baseResponse.responseStatusCode = response.status;
      baseResponse.status = StatusEnum.SUCCEED;

      return baseResponse;
    } catch (error) {
      baseResponse.status = StatusEnum.FAILED;
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
