import { Injectable } from '@nestjs/common';
import { UploadStatusEnum } from '@impler/shared';
import { CommonRepository, FileRepository, UploadRepository } from '@impler/dal';
import { MakeUploadEntryCommand } from './make-upload-entry.command';
import { FileNameService } from '../../../shared/file/name.service';
import { StorageService } from '../../../shared/storage/storage.service';

@Injectable()
export class MakeUploadEntry {
  constructor(
    private uploadRepository: UploadRepository,
    private commonRepository: CommonRepository,
    private fileRepository: FileRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService
  ) {}

  async execute({ file, templateId, extra, authHeaderValue }: MakeUploadEntryCommand) {
    const uploadId = this.commonRepository.generateMongoId();
    const fileId = await this.makeFileEntry(uploadId, file);

    return this.makeUploadEntry(templateId, fileId, uploadId, extra, authHeaderValue);
  }

  private async makeFileEntry(uploadId: string, file: Express.Multer.File): Promise<string> {
    const uploadedFileName = this.fileNameService.getUploadedFileName(file.originalname);
    const uploadedFilePath = this.fileNameService.getUploadedFilePath(uploadId, file.originalname);
    this.storageService.uploadFile(uploadedFilePath, file.buffer, file.mimetype);
    const fileEntry = await this.fileRepository.create({
      mimeType: file.mimetype,
      name: uploadedFileName,
      originalName: file.originalname,
      path: uploadedFilePath,
    });

    return fileEntry._id;
  }

  private async makeUploadEntry(
    templateId: string,
    fileId: string,
    uploadId: string,
    extra?: string,
    authHeaderValue?: string
  ) {
    return this.uploadRepository.create({
      _id: uploadId,
      _uploadedFileId: fileId,
      _templateId: templateId,
      extra: extra,
      headings: [''],
      status: UploadStatusEnum.MAPPING,
      authHeaderValue: authHeaderValue,
      totalRecords: 0,
    });
  }
}
