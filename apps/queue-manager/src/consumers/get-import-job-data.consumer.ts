/* eslint-disable multiline-comment-style */
import { PassThrough } from 'stream';
import { FileNameService, RSSXMLService } from '@impler/services';
import {
  FileMimeTypesEnum,
  ImportJobHistoryStatusEnum /*, QueuesEnum*/,
  SendImportJobCachedData,
} from '@impler/shared';
import { JobMappingRepository, CommonRepository } from '@impler/dal';
// import { publishToQueue } from '../bootstrap';
import { SendImportJobDataConsumer } from './send-import-job-data.consumer';

export class GetImportJobDataConsumer extends SendImportJobDataConsumer {
  private commonRepository: CommonRepository = new CommonRepository();
  private jobMappingRepository: JobMappingRepository = new JobMappingRepository();
  private rssXmlService: RSSXMLService = new RSSXMLService();
  private fileNameService: FileNameService = new FileNameService();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as { _jobId: string };
    const importJobHistoryId = this.commonRepository.generateMongoId().toString();
    const importedData = await this.getJobImportedData(data._jobId);

    // Create history entry
    await this.importJobHistoryRepository.create({
      _id: importJobHistoryId,
      _jobId: data._jobId,
      status: ImportJobHistoryStatusEnum.PROCESSING,
    });

    const userJobInfo = await this.userJobRepository.getUserJobWithTemplate(data._jobId);
    const webhookDestination = await this.webhookDestinationRepository.findOne({
      _templateId: userJobInfo._templateId,
    });

    // Direct API call logic here
    if (webhookDestination?.callbackUrl) {
      console.log('🚀 Sending data directly to API...');
      await this.sendDataImportData(data._jobId, importedData);
    }

    return;
  }

  async getJobImportedData(_jobId: string) {
    try {
      console.log('🚀 Starting optimized job data extraction...');

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
      console.log(mappings);

      // Parse XML once
      const parsedXMLData = await this.rssXmlService.parseXMLAndExtractData(userJob.url);
      if (!parsedXMLData) {
        throw new Error('Failed to parse XML data');
      }

      const batchResult = await this.rssXmlService.getBatchXMLKeyValuesByPaths(parsedXMLData.xmlData, mappings);
      const mappedData = await this.rssXmlService.mappingFunction(mappings, batchResult);

      console.log('Mapped Data is >>>', mappedData.length);

      // CALL YOUR DIRECT SEND LOGIC HERE
      return mappedData;
    } catch (error) {
      console.error('❌ Error in optimized job data extraction:', error);
      throw error;
    }
  }

  private async sendDataImportData(
    _jobId: string,
    allDataJson: any[],
    page = 1,
    initialCachedData?: SendImportJobCachedData
  ) {
    try {
      // Get cached data similar to the original SendImportJobDataConsumer
      let cachedData = null;
      if (!initialCachedData) {
        console.log('called initial cache');
        cachedData = await this.getInitialCachedData(_jobId, null);
      } else {
        // Use the passed cached data (which includes updated page number)
        cachedData = initialCachedData;
      }

      if (cachedData && cachedData.callbackUrl) {
        const totalPages = this.getTotalPages(allDataJson.length, cachedData.chunkSize);

        console.log(`📤 Sending ${allDataJson.length} records in ${cachedData.chunkSize} chunks... `);

        // Use the current page parameter, not cachedData.page
        const { sendData } = this.buildSendData({
          data: allDataJson,
          uploadId: _jobId,
          page: page, // Use the page parameter passed to this function
          chunkSize: cachedData.chunkSize,
          recordFormat: cachedData.recordFormat,
          chunkFormat: cachedData.chunkFormat,
          ...cachedData,
        });

        const headers =
          cachedData.authHeaderName && cachedData.authHeaderValue
            ? { [cachedData.authHeaderName]: cachedData.authHeaderValue }
            : null;

        console.log(`📡 Sending page ${page}/${totalPages}...`);

        console.log('CACHED DATA >>> ', cachedData);

        const response = await this.makeApiCall({
          data: sendData,
          uploadId: _jobId,
          page: page, // Use the page parameter
          method: 'POST',
          url: 'http://localhost:3001/api/v1/webhook/test-webhook', // cachedData.callbackUrl,
          headers,
        });

        await this.makeResponseEntry(response);

        const nextPageNumber = this.getNextPageNumber({
          totalRecords: allDataJson.length,
          currentPage: page, // Use the current page parameter
          chunkSize: cachedData.chunkSize,
        });
        console.log(cachedData);

        console.log('=================== ', page, nextPageNumber);

        if (nextPageNumber) {
          // Recursively call for next page with updated page number
          await this.sendDataImportData(_jobId, allDataJson, nextPageNumber, { ...cachedData, page: nextPageNumber });
        } else {
          // Processing is done
          await this.finalizeUpload(_jobId);
          console.log('✅ All data sent successfully!');
        }
      } else {
        console.log('❌ No webhook destination found or callback URL missing');
      }
    } catch (error) {
      console.error('❌ Error sending data directly:', error);
      throw error;
    }
  }

  private async convertRecordsToJsonFile(importJobId: string, importRecords: any[]) {
    const path = this.fileNameService.getAllJsonDataFilePath(importJobId);
    const stream = new PassThrough();
    const upload = this.storageService.writeStream(path, stream, FileMimeTypesEnum.JSON);

    try {
      const chunkSize = 5000; // Tune this depending on record size / memory constraints

      stream.write('[');

      for (let i = 0; i < importRecords.length; i += chunkSize) {
        const chunk = importRecords.slice(i, i + chunkSize);
        const jsonChunk = chunk.map((record) => JSON.stringify(record)).join(',');

        const isLast = i + chunkSize >= importRecords.length;
        const finalChunk = isLast ? jsonChunk : jsonChunk + ',';

        const canWrite = stream.write(finalChunk);
        if (!canWrite) {
          await new Promise((resolve) => stream.once('drain', resolve));
        }

        // Yield control to event loop to prevent blocking
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        await new Promise((resolve) => setImmediate(resolve));
      }

      stream.write(']');
      stream.end();

      await upload.done(); // Complete the stream upload
      console.log('✅ Upload complete');
    } catch (err) {
      console.error('❌ Upload failed:', err);
      throw err;
    }
  }
}
