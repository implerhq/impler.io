import axios from 'axios';
import { parseStringPromise } from 'xml2js';

import { StorageService, FileNameService } from '@impler/services';
import { FileMimeTypesEnum, ImportJobHistoryStatusEnum, QueuesEnum } from '@impler/shared';
import {
  UserJobRepository,
  JobMappingRepository,
  ImportJobHistoryRepository,
  CommonRepository,
  UserJobEntity,
  WebhookDestinationRepository,
} from '@impler/dal';
import { BaseConsumer } from './base.consumer';
import { publishToQueue } from '../bootstrap';
import { getStorageServiceClass } from '../helpers/serivces.helper';

export class GetImportJobDataConsumer extends BaseConsumer {
  private commonRepository: CommonRepository = new CommonRepository();
  private userJobRepository: UserJobRepository = new UserJobRepository();
  private importJobHistoryRepository: ImportJobHistoryRepository = new ImportJobHistoryRepository();
  private jobMappingRepository: JobMappingRepository = new JobMappingRepository();
  private webhookDestinationRepository: WebhookDestinationRepository = new WebhookDestinationRepository();

  private storageService: StorageService = getStorageServiceClass();
  private fileNameService: FileNameService = new FileNameService();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as { _jobId: string };
    const importJobHistoryId = this.commonRepository.generateMongoId().toString();
    const importedData = await this.getJobImportedData(data._jobId);
    await this.convertRecordsToJsonFile(importJobHistoryId, importedData);
    await this.importJobHistoryRepository.create({
      _id: importJobHistoryId,
      _jobId: data._jobId,
      allDataFilePath: this.fileNameService.getAllJsonDataFilePath(importJobHistoryId),
      status: ImportJobHistoryStatusEnum.PROCESSING,
    });

    const webhookDestination = await this.webhookDestinationRepository.findOne({
      _templateId: (data._jobId as unknown as UserJobEntity)._templateId,
    });

    if (webhookDestination?.callbackUrl) {
      publishToQueue(QueuesEnum.SEND_IMPORT_JOB_DATA, { importJobHistoryId });
    }

    return;
  }

  getXMLJsonValueByPath(obj: Record<string, any>, path: string | undefined): string | number | undefined | any {
    if (!path) {
      return undefined;
    }

    const keys = path.split('>').map((key) => key.trim());
    let current: any = obj;

    for (const key of keys) {
      if (current === undefined) return undefined;

      const isArray = key.endsWith('[]');
      const actualKey = isArray ? key.slice(0, -2) : key;

      if (Array.isArray(current)) {
        current = current.flatMap((item) => (item ? item[actualKey] : undefined)).filter(Boolean);
      } else {
        current = current ? current[actualKey] : undefined;
      }

      if (isArray && !Array.isArray(current)) {
        current = current ? [current] : [];
      }
    }

    if (Array.isArray(current)) {
      return current.filter(
        (item) =>
          typeof item === 'string' ||
          typeof item === 'number' ||
          (Array.isArray(item) && (typeof item[0] === 'string' || typeof item[0] === 'number'))
      );
    } else if (typeof current === 'string' || typeof current === 'number') {
      return current;
    }

    return undefined;
  }

  async parseXmlFromUrl(url: string): Promise<Record<string, any>> {
    try {
      const response = await axios.get(url);
      const xmlData = response.data;

      return await parseStringPromise(xmlData);
    } catch (error) {
      throw error;
    }
  }

  mappingFunction(mappingsData: any, values: any[]): any[] {
    const result = [];
    const maxLength = Math.max(...values.map((value) => (Array.isArray(value) ? value.length : 1)));

    for (let i = 0; i < maxLength; i++) {
      const item: any = {};
      mappingsData.forEach((mapping, index) => {
        const value = values[index];
        item[mapping.key] = Array.isArray(value) ? value[i] : value;
      });
      result.push(item);
    }

    return result;
  }

  async getJobImportedData(_jobId: string) {
    try {
      const userJob = await this.userJobRepository.findOne({ _id: _jobId });
      if (!userJob) {
        throw new Error(`Job not found for _jobId: ${_jobId}`);
      }

      const jobMappings = await this.jobMappingRepository.find({ _jobId });
      const mappings: { key: string; mapping: string }[] = jobMappings.map((jobMapping) => ({
        key: jobMapping.key,
        mapping: jobMapping.path,
      }));

      const xmlJsonData = await this.parseXmlFromUrl(userJob.url);

      const returnedValues = mappings.map(({ mapping }) => this.getXMLJsonValueByPath(xmlJsonData, mapping));
      const mappedData = this.mappingFunction(mappings, returnedValues);

      return mappedData;
    } catch (error) {
      throw error;
    }
  }

  private async convertRecordsToJsonFile(importJobId: string, importRecords: Record<string, any>[]) {
    const allJsonDataFilePath = this.fileNameService.getAllJsonDataFilePath(importJobId);
    await this.storageService.uploadFile(allJsonDataFilePath, JSON.stringify(importRecords), FileMimeTypesEnum.JSON);
  }
}
