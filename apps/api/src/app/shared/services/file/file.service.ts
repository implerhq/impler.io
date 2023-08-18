import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { ColumnTypesEnum, Defaults, FileEncodingsEnum, IFileInformation } from '@impler/shared';
import { ParseConfig, parse } from 'papaparse';
import { ParserOptionsArgs, parseString } from 'fast-csv';
import { EmptyFileException } from '@shared/exceptions/empty-file.exception';
import { APIMessages } from '@shared/constants';
import { InvalidFileException } from '@shared/exceptions/invalid-file.exception';
import { IExcelFileHeading } from '@shared/types/file.types';

export abstract class FileService {
  abstract getFileInformation(file: Express.Multer.File, options?: ParserOptionsArgs): Promise<IFileInformation>;
}

export class CSVFileService extends FileService {
  async getFileInformation(file: string | Express.Multer.File, options?: ParserOptionsArgs): Promise<IFileInformation> {
    return new Promise((resolve, reject) => {
      const information: IFileInformation = {
        data: [],
        headings: [],
        totalRecords: 0,
      };
      let fileContent: string;
      if (typeof file === 'string') {
        fileContent = file;
      } else {
        fileContent = file.buffer.toString(FileEncodingsEnum.CSV);
      }

      parseString(fileContent, {
        ...options,
        headers: (headers) => {
          // rename duplicate
          headers.map((el, i, ar) => {
            if (ar.indexOf(el) !== i) {
              headers[i] = `${el}_${i}`;
            }
          });

          return headers;
        },
      })
        .on('error', (error) => {
          if (error.message.includes('Parse Error')) {
            reject(new InvalidFileException());
          } else {
            reject(error);
          }
        })
        .on('headers', (headers) => information.headings.push(...headers))
        .on('data', () => information.totalRecords++)
        .on('end', () => {
          if (!information.totalRecords) return reject(new EmptyFileException());
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
    if (workbookHeaders.SheetNames.length < Defaults.ONE) throw new EmptyFileException();

    // get file headings
    const headings = XLSX.utils.sheet_to_json(workbookHeaders.Sheets[workbookHeaders.SheetNames[Defaults.ZERO]], {
      header: 1,
    })[Defaults.ZERO] as string[];
    // throw error if sheet is empty
    if (!headings || headings.length < Defaults.ONE) throw new EmptyFileException();

    // Refine headings by replacing empty heading
    let emptyHeadingCount = 0;
    const updatedHeading = [];
    for (const headingItem of headings) {
      if (!headingItem) {
        emptyHeadingCount += Defaults.ONE;
        updatedHeading.push(`${APIMessages.EMPTY_HEADING_PREFIX} ${emptyHeadingCount}`);
      } else updatedHeading.push(headingItem);
    }

    const data: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
      workbookHeaders.Sheets[workbookHeaders.SheetNames[Defaults.ZERO]],
      {
        defval: '',
      }
    );

    return {
      data,
      headings: updatedHeading,
      totalRecords: data.length,
    };
  }
  convertToCsv(file: Express.Multer.File): string {
    const fileContent = file.buffer.toString(FileEncodingsEnum.EXCEL);
    const workbookHeaders = XLSX.read(fileContent);
    const sheet = workbookHeaders.Sheets[workbookHeaders.SheetNames[Defaults.ZERO]];

    return XLSX.utils.sheet_to_csv(sheet, {
      blankrows: false,
      FS: ',',
      RS: '\n',
      strip: true,
    });
  }
  formatName(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '');
  }
  addSelectSheet(wb: ExcelJS.Workbook, heading: IExcelFileHeading): string {
    const name = this.formatName(heading.key);
    const companies = wb.addWorksheet(name);
    const companyHeadings = [name];
    companies.addRow(companyHeadings);
    heading.selectValues.forEach((value) => companies.addRow([value]));

    return name;
  }
  addSelectValidation({
    ws,
    range,
    keyName,
    isRequired,
  }: {
    ws: ExcelJS.Worksheet;
    range: string;
    keyName: string;
    isRequired: boolean;
  }) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ws.dataValidations.add(range, {
      type: 'list',
      allowBlank: !isRequired,
      formulae: [`${keyName}!$A$2:$A$9999`],
      showErrorMessage: true,
      errorTitle: 'Invalid Value',
      error: 'Please select from the list',
    });
  }
  addDateValidation({ ws, range, isRequired }: { ws: ExcelJS.Worksheet; range: string; isRequired: boolean }) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ws.dataValidations.add(range, {
      type: 'date',
      allowBlank: !isRequired,
      operator: 'greaterThan',
      formulae: [''],
      showErrorMessage: true,
      error: 'Please select a date',
      errorTitle: 'Invalid Date',
      showInputMessage: true,
      promptTitle: 'Date',
      prompt: 'Select a date',
    });
  }
  getExcelColumnNameFromIndex(columnNumber: number) {
    // To store result (Excel column name)
    const columnName = [];

    while (columnNumber > 0) {
      // Find remainder
      const rem = columnNumber % 26;

      /*
       * If remainder is 0, then a
       * 'Z' must be there in output
       */
      if (rem == 0) {
        columnName.push('Z');
        columnNumber = Math.floor(columnNumber / 26) - 1;
      } // If remainder is non-zero
      else {
        columnName.push(String.fromCharCode(rem - 1 + 'A'.charCodeAt(0)));
        columnNumber = Math.floor(columnNumber / 26);
      }
    }

    return columnName.reverse().join('');
  }
  getExcelFileForHeadings(headings: IExcelFileHeading[]): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    const headingNames = headings.map((heading) => heading.key);
    worksheet.addRow(headingNames);
    headings.forEach((heading, index) => {
      if (heading.type === ColumnTypesEnum.SELECT) {
        const keyName = this.addSelectSheet(workbook, heading);
        const columnName = this.getExcelColumnNameFromIndex(index + 1);
        this.addSelectValidation({
          ws: worksheet,
          range: `${columnName}2:${columnName}9999`,
          keyName,
          isRequired: heading.isRequired,
        });
      } else if (heading.type === ColumnTypesEnum.DATE) {
        const columnName = this.getExcelColumnNameFromIndex(index + 1);
        this.addDateValidation({
          ws: worksheet,
          range: `${columnName}2:${columnName}9999`,
          isRequired: heading.isRequired,
        });
      }
    });

    return workbook.xlsx.writeBuffer();
  }
  renameJSONHeaders(jsonData: any[], headings: string[]): Record<string, unknown>[] {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.sheet_add_aoa(ws, [headings]);
    XLSX.utils.book_append_sheet(wb, ws);

    return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[Defaults.ZERO]]);
  }
}

export class CSVFileService2 {
  getFileHeaders(file: string | Express.Multer.File, options?: ParseConfig): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let fileContent = '';
      if (typeof file === 'string') {
        fileContent = file;
      } else {
        fileContent = file.buffer.toString(FileEncodingsEnum.CSV);
      }
      parse(fileContent, {
        ...(options || {}),
        preview: 1,
        step: (results) => {
          if (Object.keys(results.data).length > Defaults.ONE) {
            resolve(results.data);
          } else {
            reject(new EmptyFileException());
          }
        },
        error: (error) => {
          if (error.message.includes('Parse Error')) {
            reject(new InvalidFileException());
          } else {
            reject(error);
          }
        },
      });
    });
  }
}
