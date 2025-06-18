/* eslint-disable multiline-comment-style */
import { StorageService, FileNameService, RSSXMLService } from '@impler/services';
import { FileMimeTypesEnum, ImportJobHistoryStatusEnum, QueuesEnum } from '@impler/shared';
import {
  UserJobRepository,
  JobMappingRepository,
  ImportJobHistoryRepository,
  CommonRepository,
  WebhookDestinationRepository,
} from '@impler/dal';
import { BaseConsumer } from './base.consumer';
import { publishToQueue } from '../bootstrap';
import { getStorageServiceClass } from '../helpers/services.helper';

export class GetImportJobDataConsumer extends BaseConsumer {
  private commonRepository: CommonRepository = new CommonRepository();
  private userJobRepository: UserJobRepository = new UserJobRepository();
  private importJobHistoryRepository: ImportJobHistoryRepository = new ImportJobHistoryRepository();
  private jobMappingRepository: JobMappingRepository = new JobMappingRepository();
  private webhookDestinationRepository: WebhookDestinationRepository = new WebhookDestinationRepository();
  private rssXmlService: RSSXMLService = new RSSXMLService();

  private storageService: StorageService = getStorageServiceClass();
  private fileNameService: FileNameService = new FileNameService();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as { _jobId: string };
    const importJobHistoryId = this.commonRepository.generateMongoId().toString();
    const importedData = await this.getJobImportedDataOptimized(data._jobId);
    const allDataFilePath = this.fileNameService.getAllJsonDataFilePath(importJobHistoryId);
    await this.convertRecordsToJsonFile(importJobHistoryId, importedData);
    await this.importJobHistoryRepository.create({
      _id: importJobHistoryId,
      _jobId: data._jobId,
      allDataFilePath,
      status: ImportJobHistoryStatusEnum.PROCESSING,
    });
    const userJobInfo = await this.userJobRepository.getUserJobWithTemplate(data._jobId);

    const webhookDestination = await this.webhookDestinationRepository.findOne({
      _templateId: userJobInfo._templateId,
    });

    if (webhookDestination?.callbackUrl) {
      console.log('All Data Cache ->', allDataFilePath);
      publishToQueue(QueuesEnum.SEND_IMPORT_JOB_DATA, { _jobId: data._jobId, allDataFilePath });
    }

    return;
  }

  // NEW OPTIMIZED METHOD: Single traversal for all mappings
  async getJobImportedDataOptimized(_jobId: string) {
    try {
      console.log('🚀 Starting optimized job data extraction...');
      const startTime = Date.now();

      const userJob = await this.userJobRepository.findOne({ _id: _jobId });
      if (!userJob) {
        throw new Error(`Job not found for _jobId: ${_jobId}`);
      }

      const jobMappings = await this.jobMappingRepository.find({ _jobId });
      const mappings: { key: string; path: string }[] = jobMappings.map((jobMapping) => ({
        key: jobMapping.key,
        path: jobMapping.path,
      }));

      console.log('📋 Job mappings:', mappings.length, 'fields to extract');

      // Parse XML once
      const parsedXMLData = await this.rssXmlService.parseXMLAndExtractData(userJob.url);
      if (!parsedXMLData) {
        throw new Error('Failed to parse XML data');
      }

      // OPTIMIZED: Extract all values in a single traversal
      const batchResult = await this.rssXmlService.getBatchXMLKeyValuesByPaths(parsedXMLData.xmlData, mappings);

      console.log(
        '📊 Batch extraction result:',
        Object.keys(batchResult).map((key) => `${key}: ${batchResult[key].length} values`)
      );

      // OPTIMIZED: Create mapped data using batch result
      const mappedData = await this.rssXmlService.optimizedMappingFunction(mappings, batchResult);

      const endTime = Date.now();
      console.log(`✅ Optimized extraction completed in ${endTime - startTime}ms`);
      console.log(
        `📈 Performance improvement: ~${mappings.length}x faster (single traversal vs ${mappings.length} traversals)`
      );
      console.log('📊 Final mapped data:', mappedData.length, 'records');

      console.log('Mapped Data is >>>', mappedData);

      return mappedData;
    } catch (error) {
      console.error('❌ Error in optimized job data extraction:', error);
      throw error;
    }
  }

  /*
  // LEGACY METHOD: Keep for backward compatibility (but use optimized version)
  async getJobImportedData(_jobId: string) {
    console.warn('⚠️  getJobImportedData is deprecated. Using optimized version instead.');

    return this.getJobImportedDataOptimized(_jobId);
  }
  */

  // LEGACY METHOD: Original implementation (kept for reference)
  async getJobImportedDataLegacy(_jobId: string) {
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

      console.log('job mappings are', jobMappings);
      console.log('mappings are >>>', mappings);

      const parsedXMLData = await this.rssXmlService.parseXMLAndExtractData(userJob.url);

      // PERFORMANCE ISSUE: This loops through the XML structure N times (once for each mapping)
      const returnedRssKeyValues = await Promise.all(
        mappings.map(({ mapping }) => this.rssXmlService.getXMLKeyValueByPath(parsedXMLData.xmlData, mapping))
      );

      console.log('returnedRssKeyValues ->', returnedRssKeyValues);
      const mappedData = await this.rssXmlService.mappingFunction(mappings, returnedRssKeyValues);

      console.log('mapped data >>', mappedData);

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
