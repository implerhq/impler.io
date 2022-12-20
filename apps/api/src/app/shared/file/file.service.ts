import * as XLSX from 'xlsx';
import { Defaults, FileEncodingsEnum, IFileInformation } from '@impler/shared';
import { ParserOptionsArgs, parseString } from 'fast-csv';
import { StorageService } from '@impler/shared';
import { EmptyFileException } from '../exceptions/empty-file.exception';
import { APIMessages } from '../constants';

export abstract class FileService {
  abstract getFileInformation(storageService: StorageService, storageKey: string): Promise<IFileInformation>;
}

export class CSVFileService extends FileService {
  async getFileInformation(storageService: StorageService, storageKey: string): Promise<IFileInformation> {
    const fileContent = await storageService.getFileContent(storageKey, FileEncodingsEnum.CSV);

    return await this.getCSVInformation(fileContent, { headers: true });
  }
  private async getCSVInformation(fileContent: string, options?: ParserOptionsArgs): Promise<IFileInformation> {
    return new Promise((resolve, reject) => {
      const information: IFileInformation = {
        data: [],
        headings: [],
        totalRecords: 0,
      };

      parseString(fileContent, options)
        .on('error', reject)
        .on('headers', (headers) => information.headings.push(...headers))
        .on('data', (row) => information.data.push(row))
        .on('end', () => {
          information.totalRecords = information.data.length;
          resolve(information);
        });
    });
  }
}
export class ExcelFileService extends FileService {
  async getFileInformation(storageService: StorageService, storageKey: string): Promise<IFileInformation> {
    const fileContent = await storageService.getFileContent(storageKey, FileEncodingsEnum.EXCEL);

    return this.getExcelInformation(fileContent);
  }
  async getExcelInformation(fileContent: string): Promise<IFileInformation> {
    const workbookHeaders = XLSX.read(fileContent);
    // Throw empty error if file do not have any sheets
    if (workbookHeaders.SheetNames.length < Defaults.DATA_LENGTH) throw new EmptyFileException();

    // get file headings
    const headings = XLSX.utils.sheet_to_json(
      workbookHeaders.Sheets[workbookHeaders.SheetNames[Defaults.LENGTH_ZERO]],
      {
        header: 1,
      }
    )[Defaults.LENGTH_ZERO] as string[];
    // throw error if sheet is empty
    if (!headings || headings.length < Defaults.DATA_LENGTH) throw new EmptyFileException();

    // Refine headings by replacing empty heading
    let emptyHeadingCount = 0;
    const updatedHeading = [];
    for (const headingItem of headings) {
      if (!headingItem) {
        emptyHeadingCount += Defaults.DATA_LENGTH;
        updatedHeading.push(`${APIMessages.EMPTY_HEADING_PREFIX} ${emptyHeadingCount}`);
      } else updatedHeading.push(headingItem);
    }

    const data: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
      workbookHeaders.Sheets[workbookHeaders.SheetNames[Defaults.LENGTH_ZERO]]
    );

    return {
      data,
      headings: updatedHeading,
      totalRecords: data.length,
    };
  }
}
