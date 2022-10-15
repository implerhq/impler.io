import { Injectable } from '@nestjs/common';
import { ColumnRepository, UploadRepository, MappingRepository, FileEntity } from '@impler/dal';
import { StorageService } from '../../../shared/storage/storage.service';
import { AJVService } from '../../service/AJV.service';

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
    const allDataFileInfo = uploadInfo._allDataFileId as unknown as FileEntity;
    let dataContent = await this.storageService.getFileContent(allDataFileInfo.path, 'utf8');
    dataContent = JSON.parse(dataContent);
    const mappings = await this.mappingRepository.find({ _uploadId: uploadId }, '_columnId columnHeading');
    const columns = await this.columnRepository.find(
      { _templateId: uploadInfo._templateId },
      'isRequired isUnique selectValues type regex'
    );

    return this.ajvService.validate(columns, mappings, dataContent);
  }
}
