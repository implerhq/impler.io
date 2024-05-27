import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { cwd } from 'node:process';
import * as xlsxPopulate from 'xlsx-populate';
import { CONSTANTS } from '@shared/constants';
import { ParseConfig, parse } from 'papaparse';
import { ColumnTypesEnum, Defaults, FileEncodingsEnum } from '@impler/shared';
import { EmptyFileException } from '@shared/exceptions/empty-file.exception';
import { InvalidFileException } from '@shared/exceptions/invalid-file.exception';
import { IExcelFileHeading } from '@shared/types/file.types';

export class ExcelFileService {
  async convertToCsv(file: Express.Multer.File, sheetName?: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const wb = XLSX.read(file.buffer);
        const ws = sheetName && wb.SheetNames.includes(sheetName) ? wb.Sheets[sheetName] : wb.Sheets[wb.SheetNames[0]];
        resolve(
          XLSX.utils.sheet_to_csv(ws, {
            blankrows: false,
            skipHidden: true,
            // rawNumbers: true, // was converting 12:12:12 to 1.3945645673
          })
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  formatName(name: string): string {
    return (
      CONSTANTS.EXCEL_DATA_SHEET_STARTER +
      name
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase()
        .slice(0, 25) // exceljs don't allow heading more than 30 characters
    );
  }
  addSelectSheet(wb: ExcelJS.Workbook, heading: IExcelFileHeading): string {
    const name = this.formatName(heading.key);
    const companies = wb.addWorksheet(name);
    const companyHeadings = [heading.key];
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
  async getExcelFileForHeadings(headings: IExcelFileHeading[], data?: Record<string, any>[]): Promise<Buffer> {
    const currentDir = cwd();
    const isMultiSelect = headings.some(
      (heading) => heading.type === ColumnTypesEnum.SELECT && heading.allowMultiSelect
    );
    const workbook = await xlsxPopulate.fromFileAsync(
      `${currentDir}/src/config/${isMultiSelect ? 'Excel Multi Select Template.xlsm' : 'Excel Template.xlsx'}`
    );
    const worksheet = workbook.sheet('Data');

    headings.forEach((heading, index) => {
      const columnName = this.getExcelColumnNameFromIndex(index + 1) + '1';
      if (heading.type === ColumnTypesEnum.SELECT && heading.allowMultiSelect)
        worksheet.cell(columnName).value(heading.key + '#MULTI');
      else worksheet.cell(columnName).value(heading.key);
    });

    headings.forEach((heading, index) => {
      if (heading.type === ColumnTypesEnum.SELECT) {
        const columnName = this.getExcelColumnNameFromIndex(index + 1);
        worksheet.range(`${columnName}2:${columnName}9999`).dataValidation({
          type: 'list',
          allowBlank: !heading.isRequired,
          formula1: `"${heading.selectValues.join(',')}"`,
          ...(!heading.allowMultiSelect
            ? {
                showErrorMessage: true,
                error: 'Please select from the list',
                errorTitle: 'Invalid Value',
              }
            : {}),
        });
      }
    });
    const headingNames = headings.map((heading) => heading.key);
    const endColumnPosition = this.getExcelColumnNameFromIndex(headings.length + 1) + '2';
    const range = workbook.sheet(0).range(`A2:${endColumnPosition}`);
    if (Array.isArray(data) && data.length > 0) {
      const rows: string[][] = data.reduce<string[][]>((acc: string[][], rowItem: Record<string, any>) => {
        acc.push(headingNames.map((headingKey) => rowItem[headingKey]));

        return acc;
      }, []);
      range.value(rows);
    }
    const buffer = await workbook.outputAsync();

    return buffer as Promise<Buffer>;
  }
  getExcelSheets(file: Express.Multer.File): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const wb = XLSX.read(file.buffer);
        resolve(wb.SheetNames);
      } catch (error) {
        reject(error);
      }
    });
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
