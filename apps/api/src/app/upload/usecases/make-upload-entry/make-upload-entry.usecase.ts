import { Injectable } from '@nestjs/common';
import {
  FileMimeTypesEnum,
  UploadStatusEnum,
  Defaults,
  ISchemaItem,
  ITemplateSchemaItem,
  ColumnTypesEnum,
  getRecordFormat,
  ColumnDelimiterEnum,
} from '@impler/shared';
import {
  ColumnRepository,
  CommonRepository,
  CustomizationRepository,
  FileEntity,
  FileRepository,
  TemplateRepository,
  UploadRepository,
} from '@impler/dal';
import { FileNameService } from '@impler/services';

import { StorageService } from '@impler/services';
import { AddUploadEntryCommand } from './add-upload-entry.command';
import { MakeUploadEntryCommand } from './make-upload-entry.command';
import { FileParseException } from '@shared/exceptions/file-parse-issue.exception';
import { CSVFileService2, ExcelFileService } from '@shared/services/file';
import { FileSizeException } from '@shared/exceptions/file-size-limit.exception';

@Injectable()
export class MakeUploadEntry {
  constructor(
    private fileRepository: FileRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private uploadRepository: UploadRepository,
    private commonRepository: CommonRepository,
    private columnRepository: ColumnRepository,
    private templateRepository: TemplateRepository,
    private customizationRepository: CustomizationRepository
  ) {}

  async execute({
    file,
    templateId,
    extra,
    authHeaderValue,
    schema,
    output,
    importId,
    imageSchema,
    selectedSheetName,
  }: MakeUploadEntryCommand) {
    const csvFileService = new CSVFileService2();
    const fileOriginalName = file.originalname;
    let csvFile: string | Express.Multer.File = file;
    if (
      file.mimetype === FileMimeTypesEnum.EXCEL ||
      file.mimetype === FileMimeTypesEnum.EXCELX ||
      file.mimetype === FileMimeTypesEnum.EXCELM
    ) {
      try {
        const fileService = new ExcelFileService();
        const opts = await fileService.getExcelRowsColumnsCount(file, selectedSheetName);
        this.analyzeLargeFile(opts, true);
        csvFile = await fileService.convertToCsv(file, selectedSheetName);
      } catch (error) {
        if (error instanceof FileSizeException) {
          throw error;
        }
        throw new FileParseException();
      }
    } else if (file.mimetype === FileMimeTypesEnum.CSV) {
      const opts = await csvFileService.getCSVMetaInfo(file);
      this.analyzeLargeFile(opts, false);
      csvFile = file;
    } else {
      throw new Error('Invalid file type');
    }

    const columns = await this.columnRepository.find(
      {
        _templateId: templateId,
      },
      // eslint-disable-next-line max-len
      'name key isRequired isUnique isFrozen selectValues dateFormats defaultValue type regex sequence allowMultiSelect alternateKeys delimiter description validators',
      {
        sort: 'sequence',
      }
    );
    const parsedImageSchema = imageSchema ? JSON.parse(imageSchema) : undefined;
    let parsedSchema: ISchemaItem[], combinedSchema: string, customRecordFormat: string, customChunkFormat: string;
    try {
      if (schema) parsedSchema = JSON.parse(schema);
    } catch (error) {}
    if (Array.isArray(parsedSchema) && parsedSchema.length > 0) {
      const formattedColumns: Record<string, Partial<ITemplateSchemaItem>> = {};
      parsedSchema.forEach((schemaItem) => {
        // overrides duplicate
        formattedColumns[schemaItem.key] = {
          name: schemaItem.name || 'Untitled Column',
          isRequired: schemaItem.isRequired || false,
          isFrozen: schemaItem.isFrozen,
          key: schemaItem.key,
          type: schemaItem.type || ColumnTypesEnum.STRING,
          regex: schemaItem.regex,
          selectValues: parsedImageSchema?.[schemaItem.key] || schemaItem.selectValues || [],
          dateFormats: Array.isArray(schemaItem.dateFormats)
            ? schemaItem.dateFormats.map((format) => format.toUpperCase())
            : Defaults.DATE_FORMATS,
          delimiter: schemaItem.delimiter || ColumnDelimiterEnum.COMMA,
          isUnique: schemaItem.isUnique || false,
          defaultValue: schemaItem.defaultValue,
          allowMultiSelect: schemaItem.allowMultiSelect,
          description: schemaItem.description,
          alternateKeys: Array.isArray(schemaItem.alternateKeys) ? schemaItem.alternateKeys : [],
          validators: Array.isArray(schemaItem.validators) ? schemaItem.validators : [],

          sequence: Object.keys(formattedColumns).length,
          columnHeading: '', // used later during mapping
        };
      });
      combinedSchema = JSON.stringify(Object.values(formattedColumns));
      if (output) {
        const formats = getRecordFormat(output);
        if (formats) {
          customChunkFormat = formats.chunkFormat;
          customRecordFormat = formats.recordFormat;
        }
      }
    } else {
      const formattedColumns = columns.map((columnItem) => ({
        ...columnItem,
        selectValues: parsedImageSchema?.[columnItem.key] || columnItem.selectValues || [],
      }));
      combinedSchema = JSON.stringify(formattedColumns);
      const defaultCustomization = await this.customizationRepository.findOne(
        {
          _templateId: templateId,
        },
        'chunkFormat recordFormat'
      );
      customChunkFormat = defaultCustomization?.chunkFormat;
      customRecordFormat = defaultCustomization?.recordFormat;
    }

    const fileHeadings = await csvFileService.getFileHeaders(csvFile);
    const uploadId = importId || this.commonRepository.generateMongoId().toString();
    const fileEntity = await this.makeFileEntry(uploadId, csvFile, fileOriginalName);

    const originalFileName = this.fileNameService.getOriginalFileName(fileOriginalName);
    const originalFilePath = this.fileNameService.getOriginalFilePath(uploadId, originalFileName);
    await this.storageService.uploadFile(originalFilePath, file.buffer, file.mimetype);

    await this.templateRepository.findOneAndUpdate(
      { _id: templateId },
      {
        $inc: {
          totalImports: 1,
        },
      }
    );

    return this.addUploadEntry({
      extra,
      uploadId,
      authHeaderValue,
      originalFileName,
      customChunkFormat,
      customRecordFormat,
      schema: combinedSchema,
      headings: fileHeadings,
      _templateId: templateId,
      _uploadedFileId: fileEntity._id,
      originalFileType: file.mimetype,
    });
  }
  roundToNiceNumber(num: number) {
    const niceNumbers = [500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

    return niceNumbers.reduce((prev, curr) => (Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev));
  }
  analyzeLargeFile(fileInfo: { rows: number; columns: number }, isExcel?: boolean, maxDataPoints = 5000000) {
    const { columns, rows } = fileInfo;
    const dataPoints = columns * rows;

    if (dataPoints > maxDataPoints) {
      let suggestedChunkSize = Math.floor(maxDataPoints / columns);
      suggestedChunkSize = this.roundToNiceNumber(suggestedChunkSize);
      const numberOfChunks = Math.ceil(rows / suggestedChunkSize);

      throw new FileSizeException({
        rows,
        isExcel,
        columns,
        files: numberOfChunks,
        recordsToSplit: suggestedChunkSize,
      });
    }
  }
  private async makeFileEntry(
    uploadId: string,
    file: string | Express.Multer.File,
    fileOriginalName: string
  ): Promise<FileEntity> {
    const uploadedFilePath = this.fileNameService.getUploadedFilePath(uploadId, fileOriginalName);
    await this.storageService.uploadFile(
      uploadedFilePath,
      typeof file === 'string' ? file : file.buffer,
      FileMimeTypesEnum.CSV
    );
    const uploadedFileName = this.fileNameService.getUploadedFileName(fileOriginalName);
    const fileEntry = await this.fileRepository.create({
      mimeType: FileMimeTypesEnum.CSV,
      name: uploadedFileName,
      originalName: fileOriginalName,
      path: uploadedFilePath,
    });

    return fileEntry;
  }

  private async addUploadEntry({
    _templateId,
    _uploadedFileId,
    _allDataFileId,
    uploadId,
    extra,
    authHeaderValue,
    headings,
    schema,
    totalRecords,
    originalFileName,
    originalFileType,
    customChunkFormat,
    customRecordFormat,
  }: AddUploadEntryCommand) {
    return this.uploadRepository.create({
      _id: uploadId,
      _uploadedFileId,
      _templateId,
      _allDataFileId,
      extra: extra,
      originalFileType,
      originalFileName,
      customSchema: schema,
      headings: Array.isArray(headings) ? headings : [],
      status: UploadStatusEnum.UPLOADED,
      authHeaderValue: authHeaderValue,
      totalRecords: totalRecords || Defaults.ZERO,
      customChunkFormat,
      customRecordFormat,
    });
  }
}
