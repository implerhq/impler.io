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
import { DalService, TemplateEntity, UploadRepository } from '@impler/dal';

@Injectable()
export class StartProcess {
  constructor(
    private dalService: DalService,
    private queueService: QueueService,
    private uploadRepository: UploadRepository,
    private paymentAPIService: PaymentAPIService
  ) {}

  async execute(_uploadId: string) {
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

    // if template destination has callbackUrl then start sending data to the callbackUrl
    if (destination) {
      uploadInfo = await this.uploadRepository.findOneAndUpdate(
        { _id: _uploadId },
        { status: UploadStatusEnum.PROCESSING }
      );
    } else {
      // else complete the upload process
      uploadInfo = await this.uploadRepository.findOneAndUpdate(
        { _id: _uploadId },
        { status: UploadStatusEnum.COMPLETED }
      );
    }
    this.queueService.publishToQueue(QueuesEnum.END_IMPORT, {
      uploadId: _uploadId,
      destination: destination,
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
}
