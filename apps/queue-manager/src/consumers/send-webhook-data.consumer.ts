import {
  FileEncodingsEnum,
  SendWebhookCachedData,
  SendWebhookData,
  UploadStatusEnum,
  QueuesEnum,
  replaceVariablesInObject,
  ITemplateSchemaItem,
  ColumnTypesEnum,
  ColumnDelimiterEnum,
  StatusEnum,
  EMAIL_SUBJECT,
} from '@impler/shared';
import { FileNameService, StorageService, EmailService } from '@impler/services';
import {
  FileEntity,
  UploadRepository,
  WebhookLogEntity,
  TemplateRepository,
  WebhookLogRepository,
  WebhookDestinationRepository,
  FailedWebhookRetryRequestsRepository,
  EnvironmentRepository,
} from '@impler/dal';

import { BaseConsumer } from './base.consumer';
import { publishToQueue } from '../bootstrap';
import { IBuildSendDataParameters } from '../types/file-processing.types';
import { getEmailServiceClass, getStorageServiceClass } from '../helpers/services.helper';

// Prototype pollution safe JSON parse - strips dangerous keys recursively
function safeJsonParse(jsonStr: string): any {
  const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

  return JSON.parse(jsonStr, (key, value) => {
    if (DANGEROUS_KEYS.includes(key)) return undefined;

    return value;
  });
}

const MIN_LIMIT = 0;
const DEFAULT_PAGE = 1;

export class SendWebhookDataConsumer extends BaseConsumer {
  private fileNameService: FileNameService = new FileNameService();
  private templateRepository: TemplateRepository = new TemplateRepository();
  private uploadRepository: UploadRepository = new UploadRepository();
  private webhookLogRepository: WebhookLogRepository = new WebhookLogRepository();
  private webhookDestinationRepository: WebhookDestinationRepository = new WebhookDestinationRepository();
  private storageService: StorageService = getStorageServiceClass();
  private emailService: EmailService = getEmailServiceClass();
  private failedWebhookRetryRequestsRepository: FailedWebhookRetryRequestsRepository =
    new FailedWebhookRetryRequestsRepository();
  private environmentRepository: EnvironmentRepository = new EnvironmentRepository();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as SendWebhookData & { isRetry?: boolean };
    const uploadId = data.uploadId;
    const isRetry = data.isRetry || false;

    try {
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

        const totalPages = this.getTotalPages(allDataJson.length, cachedData.chunkSize);
        let currentPage = cachedData.page || DEFAULT_PAGE;
        const startPage = currentPage;
        const PAGES_TO_PROCESS = 50; // Process 50 pages per message to speed up but allow heartbeats

        while (currentPage <= totalPages && currentPage < startPage + PAGES_TO_PROCESS) {
          const { sendData, page } = this.buildSendData({
            uploadId,
            data: allDataJson,
            extra: cachedData.extra,
            template: cachedData.name,
            fileName: cachedData.fileName,
            chunkSize: cachedData.chunkSize,
            defaultValues: cachedData.defaultValues,
            page: currentPage,
            recordFormat: cachedData.recordFormat,
            chunkFormat: cachedData.chunkFormat,
            totalRecords: allDataJson.length,
            imageHeadings: cachedData.imageHeadings,
            multiSelectHeadings: cachedData.multiSelectHeadings,
          });

          const headers =
            cachedData.authHeaderName && cachedData.authHeaderValue
              ? { [cachedData.authHeaderName]: cachedData.authHeaderValue }
              : null;

          const allData = {
            data: sendData,
            uploadId,
            page,
            method: 'POST',
            url: cachedData.callbackUrl,
            headers,
            isRetry,
          };

          const response = await this.makeApiCall(allData);

          await this.makeResponseEntry({
            data: response,
            projectId: cachedData.projectId,
            importName: cachedData.name,
            url: cachedData.callbackUrl,
            retryInterval: cachedData.retryInterval,
            retryCount: cachedData.retryCount,
            allData,
          });

          currentPage += 1;
        }

        if (currentPage <= totalPages) {
          // Queue next batch
          publishToQueue(QueuesEnum.SEND_WEBHOOK_DATA, {
            uploadId,
            cache: {
              ...cachedData,
              page: currentPage,
            },
          });
        } else {
          // Processing is done
          this.finalizeUpload(uploadId);
        }
      }
    } catch (error) {
      console.error(`[SendWebhookDataConsumer] Failed to process webhook for upload ${uploadId}:`, error?.message || error);
      // Update upload status to reflect the failure
      try {
        await this.uploadRepository.update({ _id: uploadId }, { status: UploadStatusEnum.COMPLETED });
      } catch (updateError) {
        console.error(`[SendWebhookDataConsumer] Failed to update upload status for ${uploadId}:`, updateError?.message);
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
    imageHeadings,
    multiSelectHeadings,
  }: IBuildSendDataParameters): { sendData: Record<string, unknown>; page: number } {
    const defaultValuesObj = JSON.parse(defaultValues);
    let slicedData = data.slice(
      Math.max((page - DEFAULT_PAGE) * chunkSize, MIN_LIMIT),
      Math.min(page * chunkSize, data.length)
    );
    if ((multiSelectHeadings && Object.keys(multiSelectHeadings).length > 0) || imageHeadings?.length > 0) {
      slicedData = slicedData.map((obj) => {
        Object.keys(multiSelectHeadings).forEach((heading) => {
          obj.record[heading] = obj.record[heading] ? obj.record[heading].split(multiSelectHeadings[heading]) : [];
        });

        if (imageHeadings?.length > 0)
          imageHeadings.forEach((heading) => {
            obj.record[heading] = obj.record[heading]
              ? `${process.env.API_ROOT_URL}/v1/upload/${uploadId}/asset/${obj.record[heading]}`
              : '';
          });

        return obj;
      });
    }
    if (recordFormat)
      slicedData = slicedData.map((obj) =>
        replaceVariablesInObject(safeJsonParse(recordFormat), obj.record, defaultValuesObj)
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
      sendData: chunkFormat ? replaceVariablesInObject(safeJsonParse(chunkFormat), sendData as any) : sendData,
      page,
    };
  }

  private async getInitialCachedData(_uploadId: string): Promise<SendWebhookCachedData> {
    // Get Upload Information
    const uploadata = await this.uploadRepository.getUploadProcessInformation(_uploadId);

    if (uploadata?._allDataFileId) return null;

    const userEmail = await this.uploadRepository.getUserEmailFromUploadId(_uploadId);

    // Get template information
    const templateData = await this.templateRepository.findById(uploadata._templateId, 'name _projectId code');

    const webhookDestination = await this.webhookDestinationRepository.findOne({ _templateId: uploadata._templateId });

    const defaultValueObj = {};
    const multiSelectHeadings = {};
    const imageHeadings = [];
    const customSchema = JSON.parse(uploadata.customSchema) as ITemplateSchemaItem[];
    if (Array.isArray(customSchema)) {
      customSchema.forEach((item: ITemplateSchemaItem) => {
        if (item.defaultValue) defaultValueObj[item.key] = item.defaultValue;
        if (item.type === ColumnTypesEnum.SELECT && item.allowMultiSelect)
          multiSelectHeadings[item.key] = item.delimiter || ColumnDelimiterEnum.COMMA;
        if (item.type === ColumnTypesEnum.IMAGE) imageHeadings.push(item.key);
      });
    }

    return {
      _templateId: uploadata._templateId,
      projectId: templateData._projectId,
      callbackUrl: webhookDestination?.callbackUrl,
      chunkSize: webhookDestination?.chunkSize,
      name: templateData.name,
      page: 1,
      authHeaderName: webhookDestination?.authHeaderName,
      authHeaderValue: uploadata.authHeaderValue,
      retryInterval: webhookDestination.retryInterval,
      retryCount: webhookDestination.retryCount,
      allDataFilePath: this.fileNameService.getAllJsonDataFilePath(_uploadId),
      fileName: (uploadata._uploadedFileId as unknown as FileEntity)?.originalName,
      extra: uploadata.extra,
      defaultValues: JSON.stringify(defaultValueObj),
      recordFormat: uploadata.customRecordFormat,
      chunkFormat: uploadata.customChunkFormat,
      multiSelectHeadings,
      imageHeadings,
      email: userEmail,
    };
  }

  private async makeResponseEntry({
    data,
    importName,
    projectId,
    url,
    allData,
    retryInterval,
    retryCount,
  }: {
    data: Partial<WebhookLogEntity>;
    importName: string;
    projectId: string;
    url: string;
    retryCount?: number;
    retryInterval?: number;
    allData: Record<string, any>;
  }) {
    const webhookLog = await this.webhookLogRepository.create(data);

    if (data.status === StatusEnum.FAILED) {
      const environment = await this.environmentRepository.getProjectTeamMembers(projectId);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const teamMemberEmails = environment.map((teamMember) => teamMember._userId.email);
      const emailContents = this.emailService.getEmailContent({
        type: 'ERROR_SENDING_WEBHOOK_DATA',
        data: {
          error: JSON.stringify(data.error, null, 2),
          importName: importName,
          time: data.callDate.toString(),
          webhookUrl: url,
          importId: data._uploadId,
        },
      });
      await Promise.all(
        teamMemberEmails.map((email) =>
          this.emailService.sendEmail({
            to: email,
            subject: `${EMAIL_SUBJECT.ERROR_SENDING_WEBHOOK_DATA} ${importName}`,
            html: emailContents,
            from: process.env.ALERT_EMAIL_FROM,
            senderName: process.env.EMAIL_FROM_NAME,
          })
        )
      );

      if (retryCount && retryInterval) {
        await this.failedWebhookRetryRequestsRepository.create({
          _webhookLogId: webhookLog._id,
          dataContent: allData,
          retryCount,
          retryInterval,
          nextRequestTime: this.getNextTime(retryInterval).toDate(),
          _uploadId: webhookLog._uploadId,
          importName: importName,
          error: webhookLog.error,
        });
      }
    }

    return webhookLog;
  }

  private async finalizeUpload(uploadId: string) {
    return await this.uploadRepository.update({ _id: uploadId }, { status: UploadStatusEnum.COMPLETED });
  }
}
