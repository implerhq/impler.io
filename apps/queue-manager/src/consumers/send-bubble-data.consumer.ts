import {
  FileEncodingsEnum,
  BubbleBaseService,
  SendBubbleData,
  UploadStatusEnum,
  QueuesEnum,
  FileNameService,
  SendBubbleCachedData,
  ITemplateSchemaItem,
  updateDefaultValues,
} from '@impler/shared';
import { StorageService } from '@impler/shared/dist/services/storage';
import { UploadRepository, WebhookLogEntity, WebhookLogRepository, BubbleDestinationRepository } from '@impler/dal';

import { BaseConsumer } from './base.consumer';
import { publishToQueue } from '../bootstrap';
import { getStorageServiceClass } from '../helpers/storage.helper';
import { IBaseSendDataParameters } from '../types/file-processing.types';

const MIN_LIMIT = 0;
const DEFAULT_PAGE = 1;

export class SendBubbleDataConsumer extends BaseConsumer {
  private bubbleBaseService: BubbleBaseService = new BubbleBaseService();
  private fileNameService: FileNameService = new FileNameService();
  private uploadRepository: UploadRepository = new UploadRepository();
  private webhookLogRepository: WebhookLogRepository = new WebhookLogRepository();
  private bubbleDestinationRepository: BubbleDestinationRepository = new BubbleDestinationRepository();
  private storageService: StorageService = getStorageServiceClass();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as SendBubbleData;
    const uploadId = data.uploadId;
    const cachedData = data.cache || (await this.getInitialCachedData(uploadId));

    if (cachedData && cachedData.bubbleUrl) {
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
        data: allDataJson,
        page: cachedData.page || DEFAULT_PAGE,
        chunkSize: cachedData.chunkSize,
        totalRecords: allDataJson.length,
        defaultValues: cachedData.defaultValues,
      });

      const response = await this.makeApiCall({
        data: sendData,
        uploadId,
        page,
        method: 'POST',
        url: cachedData.bubbleUrl,
        headers: {
          Authorization: `Bearer ${cachedData.apiPrivateKey}`,
          'Content-Type': 'text/plain',
        },
      });

      this.makeResponseEntry(response);

      const nextPageNumber = this.getNextPageNumber({
        currentPage: page,
        totalRecords: allDataJson.length,
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

  private buildSendData({ data, page = DEFAULT_PAGE, chunkSize, defaultValues }: IBaseSendDataParameters): {
    sendData: string;
    page: number;
  } {
    const defaultValuesObj = JSON.parse(defaultValues);
    let slicedData = data.slice(
      Math.max((page - DEFAULT_PAGE) * chunkSize, MIN_LIMIT),
      Math.min(page * chunkSize, data.length)
    );
    slicedData = slicedData.map((obj) => JSON.stringify(updateDefaultValues(obj.record, defaultValuesObj)));

    return {
      sendData: slicedData.join('\n'),
      page,
    };
  }

  private async getInitialCachedData(_uploadId: string): Promise<SendBubbleCachedData> {
    // Get Upload Information
    const uploadata = await this.uploadRepository.getUploadProcessInformation(_uploadId);
    if (uploadata._allDataFileId) return null;

    const bubbleDestination = await this.bubbleDestinationRepository.findOne({ _templateId: uploadata._templateId });
    const bubbleUrl = this.bubbleBaseService.createBubbleIoUrl(bubbleDestination, 'bulk');

    const defaultValueObj = {};
    const customSchema = JSON.parse(uploadata.customSchema) as ITemplateSchemaItem;
    if (Array.isArray(customSchema)) {
      customSchema.forEach((item) => {
        if (item.defaultValue) defaultValueObj[item.key] = item.defaultValue;
      });
    }

    return {
      page: 1,
      bubbleUrl,
      chunkSize: 500,
      _templateId: uploadata._templateId,
      defaultValues: JSON.stringify(defaultValueObj),
      apiPrivateKey: bubbleDestination.apiPrivateKey,
      allDataFilePath: this.fileNameService.getAllJsonDataFilePath(_uploadId),
    };
  }

  private async makeResponseEntry(data: Partial<WebhookLogEntity>) {
    return await this.webhookLogRepository.create(data);
  }

  private async finalizeUpload(uploadId: string) {
    return await this.uploadRepository.update({ _id: uploadId }, { status: UploadStatusEnum.COMPLETED });
  }
}
