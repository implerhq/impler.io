import { Injectable } from '@nestjs/common';
import { MappingRepository, UploadRepository } from '@impler/dal';

@Injectable()
export class ReanameFileHeadings {
  constructor(private uploadRepository: UploadRepository, private mappingRepository: MappingRepository) {}

  async execute(_uploadId: string): Promise<{ headings: string[] }> {
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

        return resolve({ headings: newHeadings });
      } catch (error) {
        reject(error);
      }
    });
  }
}
