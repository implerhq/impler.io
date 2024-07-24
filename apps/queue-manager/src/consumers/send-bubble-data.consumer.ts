import {
  FileEncodingsEnum,
  SendBubbleData,
  UploadStatusEnum,
  QueuesEnum,
  SendBubbleCachedData,
  ITemplateSchemaItem,
  replaceVariablesInObject,
  StatusEnum,
} from '@impler/shared';
import { BubbleBaseService, EmailService, FileNameService, StorageService } from '@impler/services';
import {
  UploadRepository,
  WebhookLogEntity,
  WebhookLogRepository,
  BubbleDestinationRepository,
  TemplateRepository,
} from '@impler/dal';

import { BaseConsumer } from './base.consumer';
import { publishToQueue } from '../bootstrap';
import { getEmailServiceClass, getStorageServiceClass } from '../helpers/serivces.helper';
import { IBaseSendDataParameters } from '../types/file-processing.types';

const MIN_LIMIT = 0;
const DEFAULT_PAGE = 1;

export class SendBubbleDataConsumer extends BaseConsumer {
  private bubbleBaseService: BubbleBaseService = new BubbleBaseService();
  private fileNameService: FileNameService = new FileNameService();
  private uploadRepository: UploadRepository = new UploadRepository();
  private templateRepository: TemplateRepository = new TemplateRepository();
  private webhookLogRepository: WebhookLogRepository = new WebhookLogRepository();
  private bubbleDestinationRepository: BubbleDestinationRepository = new BubbleDestinationRepository();
  private storageService: StorageService = getStorageServiceClass();
  private emailService: EmailService = getEmailServiceClass();

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
        recordFormat: cachedData.recordFormat,
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

      await this.makeResponseEntry(
        response,
        { datatype: cachedData.datatype, environment: cachedData.environment, url: cachedData.bubbleUrl },
        cachedData.name,
        cachedData.email
      );

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

  private buildSendData({
    data,
    page = DEFAULT_PAGE,
    chunkSize,
    defaultValues,
    recordFormat,
  }: IBaseSendDataParameters): {
    sendData: string;
    page: number;
  } {
    const defaultValuesObj = JSON.parse(defaultValues);
    let slicedData = data.slice(
      Math.max((page - DEFAULT_PAGE) * chunkSize, MIN_LIMIT),
      Math.min(page * chunkSize, data.length)
    );
    if (recordFormat)
      slicedData = slicedData.map((obj) =>
        replaceVariablesInObject(JSON.parse(recordFormat), obj.record, defaultValuesObj)
      );
    else slicedData = slicedData.map((obj) => obj.record);
    slicedData = slicedData.map((obj) => JSON.stringify(obj));

    return {
      sendData: slicedData.join('\n'),
      page,
    };
  }

  private async getInitialCachedData(_uploadId: string): Promise<SendBubbleCachedData> {
    // Get Upload Information
    const uploadata = await this.uploadRepository.getUploadProcessInformation(_uploadId);
    if (uploadata._allDataFileId) return null;

    const userEmail = await this.uploadRepository.getUserEmailFromUploadId(_uploadId);

    // Get template information
    const templateData = await this.templateRepository.findById(uploadata._templateId, 'name');

    const bubbleDestination = await this.bubbleDestinationRepository.findOne({ _templateId: uploadata._templateId });
    const bubbleUrl = this.bubbleBaseService.createBubbleIoUrl(bubbleDestination, 'bulk');

    const defaultValueObj = {};
    const customSchema = JSON.parse(uploadata.customSchema) as ITemplateSchemaItem;
    if (Array.isArray(customSchema)) {
      customSchema.forEach((item) => {
        if (item.defaultValue) defaultValueObj[item.key] = item.defaultValue;
      });
    }
    if (uploadata.extra) {
      try {
        // precaution to only proceed if "extra" is object
        const extra = JSON.parse(uploadata.extra);
        Object.keys(extra).forEach((extraObjKey) => {
          defaultValueObj[`extra.${extraObjKey}`] = extra[extraObjKey];
        });
      } catch (error) {}
    }

    return {
      page: 1,
      bubbleUrl,
      chunkSize: 500,
      email: userEmail,
      datatype: bubbleDestination.datatype,
      name: templateData.name,
      environment: bubbleDestination.environment,
      _templateId: uploadata._templateId,
      recordFormat: uploadata.customRecordFormat,
      defaultValues: JSON.stringify(defaultValueObj),
      apiPrivateKey: bubbleDestination.apiPrivateKey,
      allDataFilePath: this.fileNameService.getAllJsonDataFilePath(_uploadId),
    };
  }

  private async makeResponseEntry(
    data: Partial<WebhookLogEntity>,
    bubbleData: { datatype: string; environment: string; url: string },
    importName: string,
    userEmail: string
  ) {
    if (data.status === StatusEnum.FAILED) {
      const emailContents = this.emailService.getEmailContent({
        type: 'ERROR_SENDING_BUBBLE_DATA',
        data: {
          error: JSON.stringify(data.error, null, 2).replace(/\\+"/g, '"'),
          importName,
          time: data.callDate.toString(),
          datatype: bubbleData.datatype,
          environment: bubbleData.environment,
          url: bubbleData.url,
          importId: data._uploadId,
        },
      });

      await this.emailService.sendEmail({
        to: userEmail,
        subject: `🛑 Encountered error while sending data to Bubble in ${importName}`,
        html: emailContents,
        from: process.env.ALERT_EMAIL_FROM,
        senderName: process.env.EMAIL_FROM_NAME,
      });
    }

    return await this.webhookLogRepository.create(data);
  }

  private async finalizeUpload(uploadId: string) {
    return await this.uploadRepository.update({ _id: uploadId }, { status: UploadStatusEnum.COMPLETED });
  }
}
