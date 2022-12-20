import * as XLSX from 'xlsx';
import { Defaults, FileEncodingsEnum, IFileInformation } from '@impler/shared';
import { ParserOptionsArgs, parseString } from 'fast-csv';
import { EmptyFileException } from '../exceptions/empty-file.exception';
import { APIMessages } from '../constants';
import { InvalidFileException } from '@shared/exceptions/invalid-file.exception';

export abstract class FileService {
  abstract getFileInformation(file: Express.Multer.File, options?: ParserOptionsArgs): Promise<IFileInformation>;
}

export class CSVFileService extends FileService {
  async getFileInformation(file: Express.Multer.File, options?: ParserOptionsArgs): Promise<IFileInformation> {
    return new Promise((resolve, reject) => {
      const information: IFileInformation = {
        data: [],
        headings: [],
        totalRecords: 0,
      };
      const fileContent = file.buffer.toString(FileEncodingsEnum.CSV);

      parseString(fileContent, options)
        .on('error', (error) => {
          if (error.message.includes('Parse Error')) {
            reject(new InvalidFileException());
          } else {
            reject(error);
          }
        })
        .on('headers', (headers) => information.headings.push(...headers))
        .on('data', (row) => information.data.push(row))
        .on('end', () => {
          if (!information.data.length) return reject(new EmptyFileException());
          information.totalRecords = information.data.length;
          resolve(information);
        });
    });
  }
}
export class ExcelFileService extends FileService {
  async getFileInformation(file: Express.Multer.File): Promise<IFileInformation> {
    const fileContent = file.buffer.toString(FileEncodingsEnum.EXCEL);
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
