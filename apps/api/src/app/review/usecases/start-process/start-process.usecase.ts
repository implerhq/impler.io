import { Injectable } from '@nestjs/common';
import {
  ColumnTypesEnum,
  ITemplateSchemaItem,
  QueuesEnum,
  UploadStatusEnum,
  replaceVariablesInObject,
  DestinationsEnum,
  ColumnDelimiterEnum,
} from '@impler/shared';
import { PaymentAPIService } from '@impler/services';
import { QueueService } from '@shared/services/queue.service';
import { AmplitudeService } from '@shared/services/amplitude.service';
import { DalService, TemplateEntity, TemplateRepository, UploadEntity, UploadRepository } from '@impler/dal';
import { MaxRecordsExceededException } from '@shared/exceptions/max-records.exception';

@Injectable()
export class StartProcess {
  constructor(
    private dalService: DalService,
    private queueService: QueueService,
    private uploadRepository: UploadRepository,
    private amplitudeService: AmplitudeService,
    private paymentAPIService: PaymentAPIService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(_uploadId: string, maxRecords?: number) {
    let uploadInfo = await this.uploadRepository.getUploadWithTemplate(_uploadId, ['destination']);
    let importedData;
    const destination = (uploadInfo._templateId as unknown as TemplateEntity)?.destination;
    const userEmail = await this.uploadRepository.getUserEmailFromUploadId(_uploadId);
    const dataProcessingAllowed = await this.paymentAPIService.checkEvent({
      email: userEmail,
    });

    if (
      dataProcessingAllowed &&
      (uploadInfo._templateId as unknown as TemplateEntity).destination === DestinationsEnum.FRONTEND
    ) {
      importedData = await this.getImportedData({
        uploadId: _uploadId,
        customSchema: uploadInfo.customSchema,
        recordFormat: uploadInfo.customRecordFormat,
      });
    }

    await this.updateTemplateStatistics({ uploadInfo, userEmail, maxRecords });

    // if destination is frontend or not defined then complete the upload process
    if (
      !destination ||
      (uploadInfo._templateId as unknown as TemplateEntity).destination === DestinationsEnum.FRONTEND
    ) {
      uploadInfo = await this.uploadRepository.findOneAndUpdate(
        { _id: _uploadId },
        { status: UploadStatusEnum.COMPLETED }
      );
    } else {
      // if template destination has callbackUrl then start sending data to the callbackUrl
      uploadInfo = await this.uploadRepository.findOneAndUpdate(
        { _id: _uploadId },
        { status: UploadStatusEnum.PROCESSING }
      );
    }

    this.amplitudeService.recordsImported(userEmail, {
      records: uploadInfo.totalRecords,
      valid: uploadInfo.validRecords,
      invalid: uploadInfo.invalidRecords,
    });

    this.queueService.publishToQueue(QueuesEnum.END_IMPORT, {
      uploadId: _uploadId,
      destination: destination,
      uploadedFileId: uploadInfo._uploadedFileId,
    });

    return { uploadInfo, importedData };
  }

  async getImportedData({
    uploadId,
    customSchema,
    recordFormat,
  }: {
    uploadId: string;
    customSchema: string;
    recordFormat?: string;
  }) {
    let importedData: any[] = await this.dalService.getAllRecords(uploadId);
    const defaultValuesObj = {};
    const multiSelectHeadings = {};
    const parsesdCustomSchema = JSON.parse(customSchema) as ITemplateSchemaItem[];
    if (Array.isArray(parsesdCustomSchema)) {
      parsesdCustomSchema.forEach((item: ITemplateSchemaItem) => {
        if (item.defaultValue) defaultValuesObj[item.key] = item.defaultValue;
        if (item.type === ColumnTypesEnum.SELECT && item.allowMultiSelect)
          multiSelectHeadings[item.key] = item.delimiter || ColumnDelimiterEnum.COMMA;
      });
    }

    if (multiSelectHeadings && Object.keys(multiSelectHeadings).length > 0) {
      importedData = importedData.map((obj) => {
        Object.keys(multiSelectHeadings).forEach((heading) => {
          obj.record[heading] = obj.record[heading] ? obj.record[heading].split(multiSelectHeadings[heading]) : [];
        });

        return obj;
      });
    }
    if (recordFormat)
      importedData = importedData.map((obj) =>
        replaceVariablesInObject(JSON.parse(recordFormat), obj.record, defaultValuesObj)
      );
    else importedData = importedData.map((obj) => obj.record);

    return importedData;
  }

  private async updateTemplateStatistics({
    uploadInfo,
    userEmail,
    maxRecords,
  }: {
    uploadInfo: UploadEntity;
    userEmail: string;
    maxRecords?: number;
  }) {
    //if its a file based import do-review will handle the further process
    if (uploadInfo._uploadedFileId || uploadInfo.originalFileName) {
      return;
    }
    await this.templateRepository.findOneAndUpdate(
      {
        _id: uploadInfo._templateId,
      },
      {
        $inc: {
          totalUploads: uploadInfo.totalRecords,
          totalRecords: uploadInfo.totalRecords,
          totalInvalidRecords: uploadInfo.invalidRecords,
        },
      }
    );
    if (maxRecords && uploadInfo.totalRecords > maxRecords) {
      throw new MaxRecordsExceededException({
        actualRecords: uploadInfo.totalRecords,
        maxAllowed: maxRecords,
      });
    }
    await this.paymentAPIService.createEvent(
      {
        uploadId: uploadInfo._id,
        totalRecords: uploadInfo.totalRecords,
        validRecords: uploadInfo.validRecords,
        invalidRecords: uploadInfo.invalidRecords,
      },
      userEmail
    );
  }
}
