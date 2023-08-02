import { Injectable } from '@nestjs/common';
import { FileMimeTypesEnum, UploadStatusEnum, Defaults } from '@impler/shared';
import { CommonRepository, FileEntity, FileRepository, TemplateRepository, UploadRepository } from '@impler/dal';

import { AddUploadEntryCommand } from './add-upload-entry.command';
import { MakeUploadEntryCommand } from './make-upload-entry.command';
import { StorageService } from '@impler/shared/dist/services/storage';
import { CSVFileService, ExcelFileService, FileNameService } from '@shared/services/file';

@Injectable()
export class MakeUploadEntry {
  constructor(
    private uploadRepository: UploadRepository,
    private commonRepository: CommonRepository,
    private fileRepository: FileRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository
  ) {}

  async execute({ file, templateId, extra, authHeaderValue }: MakeUploadEntryCommand) {
    const fileOriginalName = file.originalname;
    let csvFile: string | Express.Multer.File = file;
    if (file.mimetype === FileMimeTypesEnum.EXCEL || file.mimetype === FileMimeTypesEnum.EXCELX) {
      const fileService = new ExcelFileService();
      csvFile = fileService.convertToCsv(file);
    } else if (file.mimetype === FileMimeTypesEnum.CSV) {
      csvFile = file;
    } else if (file.mimetype !== FileMimeTypesEnum.CSV) {
      throw new Error('Invalid file type');
    }

    const fileService = new CSVFileService();
    const fileInformation = await fileService.getFileInformation(csvFile, { headers: true });
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

    return this.addUploadEntry(
      AddUploadEntryCommand.create({
        _templateId: templateId,
        _uploadedFileId: fileEntity._id,
        uploadId,
        extra,
        authHeaderValue,
        headings: fileInformation.headings,
        totalRecords: fileInformation.totalRecords,
      })
    );
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
    totalRecords,
  }: AddUploadEntryCommand) {
    return this.uploadRepository.create({
      _id: uploadId,
      _uploadedFileId,
      _templateId,
      _allDataFileId,
      extra: extra,
      headings: Array.isArray(headings) ? headings : [],
      status: UploadStatusEnum.UPLOADED,
      authHeaderValue: authHeaderValue,
      totalRecords: totalRecords || Defaults.ZERO,
    });
  }
}
