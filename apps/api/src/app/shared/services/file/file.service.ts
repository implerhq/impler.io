import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { ParseConfig, parse } from 'papaparse';
import { ColumnTypesEnum, Defaults, FileEncodingsEnum } from '@impler/shared';
import { EmptyFileException } from '@shared/exceptions/empty-file.exception';
import { InvalidFileException } from '@shared/exceptions/invalid-file.exception';
import { IExcelFileHeading } from '@shared/types/file.types';

export class ExcelFileService {
  async convertToCsv(file: Express.Multer.File): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const wb = XLSX.read(file.buffer);
        const ws = wb.Sheets[wb.SheetNames[0]];
        resolve(
          XLSX.utils.sheet_to_csv(ws, {
            blankrows: false,
            skipHidden: true,
          })
        );
      } catch (error) {
        reject(error);
      }
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
  getExcelFileForHeadings(headings: IExcelFileHeading[], data?: Record<string, any>[]): Promise<Buffer> {
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

    if (Array.isArray(data) && data.length > 0) {
      const rows: string[][] = data.reduce<string[][]>((acc: string[][], rowItem: Record<string, any>) => {
        acc.push(headingNames.map((headingKey) => rowItem[headingKey]));

        return acc;
      }, []);
      worksheet.addRows(rows);
    }

    return workbook.xlsx.writeBuffer() as Promise<Buffer>;
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
      let headings: string[];
      let recordIndex = -1;
      parse(fileContent, {
        ...(options || {}),
        preview: 2,
        step: (results) => {
          recordIndex++;
          if (recordIndex === Defaults.ZERO) {
            if (Array.isArray(results.data) && results.data.length > Defaults.ZERO) headings = results.data as string[];
            else reject(new EmptyFileException());
          } else resolve(headings);
        },
        error: (error) => {
          if (error.message.includes('Parse Error')) {
            reject(new InvalidFileException());
          } else {
            reject(error);
          }
        },
        complete: () => {
          if (recordIndex !== Defaults.ONE) {
            reject(new EmptyFileException());
          }
        },
      });
    });
  }
}
