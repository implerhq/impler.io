import { FileEncodingsEnum, UploadStatusEnum } from '@impler/shared';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ColumnRepository, UploadRepository, MappingRepository, FileEntity } from '@impler/dal';
import { StorageService } from '../../../shared/storage/storage.service';
import { AJVService } from '../../service/AJV.service';
import { APIMessages } from '../../../shared/constants';
import { FileNotExistError } from '../../../shared/errors/file-not-exist.error';

@Injectable()
export class DoReview {
  constructor(
    private uploadRepository: UploadRepository,
    private storageService: StorageService,
    private columnRepository: ColumnRepository,
    private mappingRepository: MappingRepository,
    private ajvService: AJVService
  ) {}

  async execute(uploadId: string) {
    const uploadInfo = await this.uploadRepository.getUploadInformation(uploadId);
    if (!uploadInfo) {
      throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
    }
    if (uploadInfo.status !== UploadStatusEnum.MAPPED) {
      throw new BadRequestException(APIMessages.FILE_MAPPING_REMAINING);
    }
    const allDataFileInfo = uploadInfo._allDataFileId as unknown as FileEntity;
    const dataContent = await this.getFileContent(allDataFileInfo.path);
    const mappings = await this.mappingRepository.find({ _uploadId: uploadId }, '_columnId columnHeading');
    const columns = await this.columnRepository.find(
      { _templateId: uploadInfo._templateId },
      'isRequired isUnique selectValues type regex'
    );
    const reviewData = this.ajvService.validate(columns, mappings, dataContent);
    this.uploadRepository.update({ _id: uploadId }, { status: UploadStatusEnum.REVIEWING });

    return reviewData;
  }

  async getFileContent(path): Promise<string> {
    try {
      const dataContent = await this.storageService.getFileContent(path, FileEncodingsEnum.JSON);

      return JSON.parse(dataContent);
    } catch (error) {
      if (error instanceof FileNotExistError) {
        throw new BadRequestException(APIMessages.FILE_NOT_FOUND_IN_STORAGE);
      }
      throw error;
    }
  }
}
