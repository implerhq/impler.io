import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { FileMimeTypesEnum } from '@impler/shared';
import { FileNameService } from '@shared/services/file';
import { StorageService } from '@impler/shared/dist/services/storage';
import { FileRepository, MappingRepository, UploadRepository } from '@impler/dal';

@Injectable()
export class ReanameFileHeadings {
  constructor(
    private fileRepository: FileRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private uploadRepository: UploadRepository,
    private mappingRepository: MappingRepository
  ) {}

  async execute(_uploadId: string): Promise<{ totalRecords: number; _allDataFileId: string; headings: string[] }> {
    return new Promise(async (resolve, reject) => {
      try {
        const uploadInfo = await this.uploadRepository.findById(_uploadId, 'headings _uploadedFileId');
        const mappingInfo = await this.mappingRepository.getMappingWithColumnInfo(_uploadId);

        const newHeadings = uploadInfo.headings.reduce((headingsArr, heading) => {
          const foundMapping = mappingInfo.find((mapping) => mapping.columnHeading === heading);
          if (foundMapping) headingsArr.push(foundMapping.column.key);
          else headingsArr.push(heading);

          return headingsArr;
        }, []);

        // _uploadedFileId
        const allCSVDataFilePath = this.fileNameService.getAllCSVDataFilePath(_uploadId);
        const allCSVDataFileStream = new Readable({
          read() {},
        });
        this.storageService.writeStream(allCSVDataFilePath, allCSVDataFileStream, FileMimeTypesEnum.CSV);

        const allDataFileEntry = await this.fileRepository.create({
          path: allCSVDataFilePath,
          mimeType: FileMimeTypesEnum.CSV,
          originalName: this.fileNameService.getAllCSVDataFileName(),
          name: this.fileNameService.getAllCSVDataFileName(),
        });
        const fileInfo = await this.fileRepository.findById(uploadInfo._uploadedFileId);
        const fileStream = await this.storageService.getFileStream(fileInfo.path);
        let totalRecords = 0;
        let chunks = 0;
        fileStream
          .on('data', (chunk: Buffer) => {
            chunks++;
            const str = chunk.toString();
            totalRecords += str.split('\n').length;
            if (chunks > 1) allCSVDataFileStream.push(str + '\n');
            else {
              const recordArr = str.split('\n');
              recordArr[0] = newHeadings.join(',');
              allCSVDataFileStream.push(recordArr.join('\n') + '\n');
            }
          })
          .on('end', () => {
            allCSVDataFileStream.push(null);
            resolve({ totalRecords, _allDataFileId: allDataFileEntry._id, headings: newHeadings });
          });
      } catch (error) {
        reject(error);
      }
    });
  }
}
