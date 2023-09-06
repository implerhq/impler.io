import { Injectable } from '@nestjs/common';
import { FileMimeTypesEnum, UploadStatusEnum, Defaults, ISchemaItem } from '@impler/shared';
import {
  ColumnEntity,
  ColumnRepository,
  CommonRepository,
  FileEntity,
  FileRepository,
  TemplateRepository,
  UploadRepository,
} from '@impler/dal';

import { mergeObjects } from '@shared/helpers/common.helper';
import { AddUploadEntryCommand } from './add-upload-entry.command';
import { MakeUploadEntryCommand } from './make-upload-entry.command';
import { StorageService } from '@impler/shared/dist/services/storage';
import { CSVFileService2, ExcelFileService, FileNameService } from '@shared/services/file';

@Injectable()
export class MakeUploadEntry {
  constructor(
    private uploadRepository: UploadRepository,
    private commonRepository: CommonRepository,
    private fileRepository: FileRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private columnRepository: ColumnRepository,
    private templateRepository: TemplateRepository
  ) {}

  async execute({ file, templateId, extra, authHeaderValue, schema }: MakeUploadEntryCommand) {
    const fileOriginalName = file.originalname;
    let csvFile: string | Express.Multer.File = file;
    if (file.mimetype === FileMimeTypesEnum.EXCEL || file.mimetype === FileMimeTypesEnum.EXCELX) {
      const fileService = new ExcelFileService();
      csvFile = await fileService.convertToCsv(file);
    } else if (file.mimetype === FileMimeTypesEnum.CSV) {
      csvFile = file;
    } else {
      throw new Error('Invalid file type');
    }

    const columns = await this.columnRepository.find(
      {
        _templateId: templateId,
      },
      'key isRequired isUnique selectValues type regex sequence',
      {
        sort: 'sequence',
      }
    );
    let parsedSchema: ISchemaItem[], combinedSchema: string;
    try {
      if (schema) parsedSchema = JSON.parse(schema);
    } catch (error) {}
    if (Array.isArray(parsedSchema) && parsedSchema.length > 0) {
      const formattedColumns: Record<string, ColumnEntity> = columns.reduce((acc, column) => {
        acc[column.key] = { ...column };

        return acc;
      }, {});
      parsedSchema.forEach((schemaItem) => {
        if (formattedColumns.hasOwnProperty(schemaItem.key)) {
          mergeObjects(formattedColumns[schemaItem.key], schemaItem, [
            'isRequired',
            'isUnique',
            'selectValues',
            'type',
            'regex',
          ]);
        }
      });
      combinedSchema = JSON.stringify(Object.values(formattedColumns));
    } else {
      combinedSchema = JSON.stringify(columns);
    }

    const fileService = new CSVFileService2();
    const fileHeadings = await fileService.getFileHeaders(csvFile);
    const uploadId = this.commonRepository.generateMongoId().toString();
    const fileEntity = await this.makeFileEntry(uploadId, csvFile, fileOriginalName);

    await this.templateRepository.findOneAndUpdate(
      { _id: templateId },
      {
        $inc: {
          totalImports: 1,
        },
      }
    );

    return this.addUploadEntry({
      _templateId: templateId,
      _uploadedFileId: fileEntity._id,
      uploadId,
      extra,
      authHeaderValue,
      schema: combinedSchema,
      headings: fileHeadings,
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
    const uploadedFileName = 'uploaded.csv';
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
  }: AddUploadEntryCommand) {
    return this.uploadRepository.create({
      _id: uploadId,
      _uploadedFileId,
      _templateId,
      _allDataFileId,
      extra: extra,
      customSchema: schema,
      headings: Array.isArray(headings) ? headings : [],
      status: UploadStatusEnum.UPLOADED,
      authHeaderValue: authHeaderValue,
      totalRecords: totalRecords || Defaults.ZERO,
    });
  }
}
