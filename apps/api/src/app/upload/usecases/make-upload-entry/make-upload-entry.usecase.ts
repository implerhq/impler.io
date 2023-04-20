import { Injectable } from '@nestjs/common';
import { FileMimeTypesEnum, UploadStatusEnum } from '@impler/shared';
import { CommonRepository, FileEntity, FileRepository, TemplateRepository, UploadRepository } from '@impler/dal';
import { MakeUploadEntryCommand } from './make-upload-entry.command';
import { FileNameService } from '@shared/file/name.service';
import { Defaults } from '@impler/shared';
import { StorageService } from '@impler/shared/dist/services/storage';
import { FileService } from '@shared/file/file.service';
import { getFileService } from '@shared/helpers/file.helper';
import { AddUploadEntryCommand } from './add-upload-entry.command';

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
    const fileService: FileService = getFileService(file.mimetype);
    const fileInformation = await fileService.getFileInformation(file, { headers: true });
    const uploadId = this.commonRepository.generateMongoId();
    const fileEntity = await this.makeFileEntry(uploadId, file);
    const allDataFile = await this.addAllDataEntry(uploadId, fileInformation.data);

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
        _allDataFileId: allDataFile._id,
        uploadId,
        extra,
        authHeaderValue,
        headings: fileInformation.headings,
        totalRecords: fileInformation.totalRecords,
      })
    );
  }

  private async makeFileEntry(uploadId: string, file: Express.Multer.File): Promise<FileEntity> {
    const uploadedFilePath = this.fileNameService.getUploadedFilePath(uploadId, file.originalname);
    await this.storageService.uploadFile(uploadedFilePath, file.buffer, file.mimetype);
    const uploadedFileName = this.fileNameService.getUploadedFileName(file.originalname);
    const fileEntry = await this.fileRepository.create({
      mimeType: file.mimetype,
      name: uploadedFileName,
      originalName: file.originalname,
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

  private async addAllDataEntry(uploadId: string, data: Record<string, unknown>[]): Promise<FileEntity> {
    const allDataFileName = this.fileNameService.getAllJsonDataFileName();
    const allDataFilePath = this.fileNameService.getAllJsonDataFilePath(uploadId);
    await this.storageService.uploadFile(allDataFilePath, JSON.stringify(data), FileMimeTypesEnum.JSON);

    return await this.fileRepository.create({
      mimeType: FileMimeTypesEnum.JSON,
      path: allDataFilePath,
      name: allDataFileName,
      originalName: allDataFileName,
    });
  }
}
