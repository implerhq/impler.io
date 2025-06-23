import { RSSXMLService } from '@impler/services';
import { ImportJobHistoryStatusEnum, SendImportJobCachedData } from '@impler/shared';
import { JobMappingRepository, CommonRepository } from '@impler/dal';
import { SendImportJobDataConsumer } from './send-import-job-data.consumer';

export class GetImportJobDataConsumer extends SendImportJobDataConsumer {
  private commonRepository: CommonRepository = new CommonRepository();
  private jobMappingRepository: JobMappingRepository = new JobMappingRepository();
  private rssXmlService: RSSXMLService = new RSSXMLService();

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

    if (webhookDestination?.callbackUrl) {
      await this.sendDataImportData(data._jobId, importedData);
    }

    return;
  }

  async getJobImportedData(_jobId: string) {
    try {
      const userJob = await this.userJobRepository.findOne({ _id: _jobId });
      if (!userJob) {
        throw new Error(`Job not found for _jobId: ${_jobId}`);
      }

      const jobMappings = await this.jobMappingRepository.find({ _jobId });
      const mappings: { key: string; path: string }[] = jobMappings.map((jobMapping) => ({
        key: jobMapping.key,
        path: jobMapping.path,
      }));

      const parsedXMLData = await this.rssXmlService.parseXMLAndExtractData({
        xmlUrl: userJob.url,
      });
      if (!parsedXMLData) {
        throw new Error('Failed to parse XML data');
      }

      const batchResult = await this.rssXmlService.getBatchXMLKeyValuesByPaths(parsedXMLData.xmlData, mappings);
      const mappedData = await this.rssXmlService.mappingFunction(mappings, batchResult);

      return mappedData;
    } catch (error) {
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
      let cachedData = null;
      if (!initialCachedData) {
        cachedData = await this.getInitialCachedData(_jobId, null);
      } else {
        cachedData = initialCachedData;
      }

      if (cachedData && cachedData.callbackUrl) {
        const { sendData } = this.buildSendData({
          data: allDataJson,
          uploadId: _jobId,
          page,
          chunkSize: cachedData.chunkSize,
          recordFormat: cachedData.recordFormat,
          chunkFormat: cachedData.chunkFormat,
          ...cachedData,
        });

        const headers =
          cachedData.authHeaderName && cachedData.authHeaderValue
            ? { [cachedData.authHeaderName]: cachedData.authHeaderValue }
            : null;

        const response = await this.makeApiCall({
          data: sendData,
          uploadId: _jobId,
          page,
          method: 'POST',
          url: cachedData.callbackUrl,
          headers,
        });

        await this.makeResponseEntry(response);

        const nextPageNumber = this.getNextPageNumber({
          totalRecords: allDataJson.length,
          currentPage: page,
          chunkSize: cachedData.chunkSize,
        });

        if (nextPageNumber) {
          // Recursively call for next page with updated page number
          await this.sendDataImportData(_jobId, allDataJson, nextPageNumber, { ...cachedData, page: nextPageNumber });
        } else {
          // Processing is done
          await this.finalizeUpload(_jobId);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
