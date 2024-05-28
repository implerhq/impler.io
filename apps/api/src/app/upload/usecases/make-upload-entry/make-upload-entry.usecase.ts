import { Injectable } from '@nestjs/common';
import {
  FileMimeTypesEnum,
  UploadStatusEnum,
  Defaults,
  ISchemaItem,
  FileNameService,
  ITemplateSchemaItem,
  ColumnTypesEnum,
  getRecordFormat,
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

import { AddUploadEntryCommand } from './add-upload-entry.command';
import { MakeUploadEntryCommand } from './make-upload-entry.command';
import { StorageService } from '@impler/shared/dist/services/storage';
import { FileParseException } from '@shared/exceptions/file-parse-issue.exception';
import { CSVFileService2, ExcelFileService } from '@shared/services/file';

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
    selectedSheetName,
  }: MakeUploadEntryCommand) {
    const fileOriginalName = file.originalname;
    let csvFile: string | Express.Multer.File = file;
    if (
      file.mimetype === FileMimeTypesEnum.EXCEL ||
      file.mimetype === FileMimeTypesEnum.EXCELX ||
      file.mimetype === FileMimeTypesEnum.EXCELM
    ) {
      try {
        const fileService = new ExcelFileService();
        csvFile = await fileService.convertToCsv(file, selectedSheetName);
      } catch (error) {
        throw new FileParseException();
      }
    } else if (file.mimetype === FileMimeTypesEnum.CSV) {
      csvFile = file;
    } else {
      throw new Error('Invalid file type');
    }

    const columns = await this.columnRepository.find(
      {
        _templateId: templateId,
      },
      'name key isRequired isUnique selectValues dateFormats defaultValue type regex sequence allowMultiSelect',
      {
        sort: 'sequence',
      }
    );
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
          key: schemaItem.key,
          type: schemaItem.type || ColumnTypesEnum.STRING,
          regex: schemaItem.regex,
          selectValues:
            schemaItem.type == ColumnTypesEnum.SELECT && Array.isArray(schemaItem.selectValues)
              ? schemaItem.selectValues
              : [],
          dateFormats: Array.isArray(schemaItem.dateFormats)
            ? schemaItem.dateFormats.map((format) => format.toUpperCase())
            : Defaults.DATE_FORMATS,
          isUnique: schemaItem.isUnique || false,
          defaultValue: schemaItem.defaultValue,
          allowMultiSelect: schemaItem.allowMultiSelect,

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
      combinedSchema = JSON.stringify(columns);
      const defaultCustomization = await this.customizationRepository.findOne(
        {
          _templateId: templateId,
        },
        'chunkFormat recordFormat'
      );
      customChunkFormat = defaultCustomization?.chunkFormat;
      customRecordFormat = defaultCustomization?.recordFormat;
    }

    const fileService = new CSVFileService2();
    const fileHeadings = await fileService.getFileHeaders(csvFile);
    const uploadId = this.commonRepository.generateMongoId().toString();
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
