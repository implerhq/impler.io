import { RSSXMLService } from '@impler/services';
import { ImportJobHistoryStatusEnum, SendImportJobCachedData, ColumnTypesEnum } from '@impler/shared';
import { JobMappingRepository, CommonRepository, ColumnRepository } from '@impler/dal';
import { SendImportJobDataConsumer } from './send-import-job-data.consumer';

export class GetImportJobDataConsumer extends SendImportJobDataConsumer {
  private commonRepository: CommonRepository = new CommonRepository();
  private jobMappingRepository: JobMappingRepository = new JobMappingRepository();
  private columnRepo: ColumnRepository = new ColumnRepository();
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

  async getJobImportedData(_jobId: string): Promise<Record<string, any>[]> {
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

      const hasInvalidRecords = await this.validateWithTemplateColumns(_jobId, mappedData);

      if (hasInvalidRecords) {
        await this.userJobRepository.update({ _id: _jobId }, { $set: { isInvalidRecords: true } });
      }

      return mappedData as Record<string, any>[];
    } catch (error) {
      throw error;
    }
  }

  private async validateWithTemplateColumns(_jobId: string, mappedData: Record<string, any>[]): Promise<boolean> {
    enum ValidationTypesEnum {
      RANGE = 'range',
      LENGTH = 'length',
      UNIQUE_WITH = 'unique_with',
      DIGITS = 'digits',
    }

    try {
      const userJob = await this.userJobRepository.findOne({ _id: _jobId });
      const columns = await this.columnRepo.find({ _templateId: userJob._templateId });

      if (!columns || columns.length === 0) {
        return false;
      }

      let invalidRecordCount = 0;
      const totalRecords = mappedData.length;

      for (const record of mappedData) {
        let recordHasErrors = false;

        for (const column of columns) {
          const value = record[column.key];

          if (column.isRequired && (!value || value === '' || value === null)) {
            recordHasErrors = true;
            break;
          }

          if (value && value !== '') {
            switch (column.type) {
              case ColumnTypesEnum.NUMBER:
                if (isNaN(Number(value))) recordHasErrors = true;
                break;
              case ColumnTypesEnum.DOUBLE:
                if (isNaN(Number(value)) || !Number.isFinite(Number(value))) recordHasErrors = true;
                break;
              case ColumnTypesEnum.EMAIL:
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) recordHasErrors = true;
                break;
              case ColumnTypesEnum.DATE:
                if (isNaN(Date.parse(value))) recordHasErrors = true;
                break;
              case ColumnTypesEnum.REGEX:
                if (column.regex && !new RegExp(column.regex).test(value)) {
                  recordHasErrors = true;
                }
                break;
              case ColumnTypesEnum.SELECT:
                if (column.selectValues && !column.selectValues.includes(value)) {
                  recordHasErrors = true;
                }
                break;
              case ColumnTypesEnum.IMAGE:
                // Basic URL validation for images
                const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
                if (!imageUrlRegex.test(value)) recordHasErrors = true;
                break;
            }
          }

          if (!recordHasErrors && column.validations && column.validations.length > 0) {
            for (const validation of column.validations) {
              switch (validation.validate) {
                case ValidationTypesEnum.RANGE:
                  const numValue = Number(value);
                  if (!isNaN(numValue)) {
                    if (validation.min !== undefined && numValue < validation.min) {
                      recordHasErrors = true;
                    }
                    if (validation.max !== undefined && numValue > validation.max) {
                      recordHasErrors = true;
                    }
                  }
                  break;
                case ValidationTypesEnum.LENGTH:
                  const strValue = String(value);
                  if (validation.min !== undefined && strValue.length < validation.min) {
                    recordHasErrors = true;
                  }
                  if (validation.max !== undefined && strValue.length > validation.max) {
                    recordHasErrors = true;
                  }
                  break;
                case ValidationTypesEnum.DIGITS:
                  const digitStr = String(value).replace(/[^0-9]/g, '');
                  if (validation.min !== undefined && digitStr.length < validation.min) {
                    recordHasErrors = true;
                  }
                  if (validation.max !== undefined && digitStr.length > validation.max) {
                    recordHasErrors = true;
                  }
                  break;
                case ValidationTypesEnum.UNIQUE_WITH:
                  break;
              }
              if (recordHasErrors) break;
            }
          }

          if (recordHasErrors) break;
        }

        if (recordHasErrors) {
          invalidRecordCount++;
        }
      }

      // Consider batch invalid if >30% of records have validation errors
      return totalRecords > 0 && invalidRecordCount / totalRecords > 0.3;
    } catch (error) {
      return false;
    }
  }

  private async sendDataImportData(
    _jobId: string,
    allDataJson: Record<string, any>[],
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
