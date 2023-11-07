import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { ITemplateSchemaItem } from '@impler/shared';

@Injectable()
export class ReanameFileHeadings {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string): Promise<{ headings: string[] }> {
    return new Promise(async (resolve, reject) => {
      try {
        const uploadInfo = await this.uploadRepository.findById(_uploadId, 'headings _uploadedFileId customSchema');
        const templateColumnItems = JSON.parse(uploadInfo.customSchema) as ITemplateSchemaItem[];

        const newHeadings = uploadInfo.headings.reduce((headingsArr, heading) => {
          const foundColumnMapping = templateColumnItems.find((mapping) => mapping.columnHeading === heading);
          if (foundColumnMapping) headingsArr.push(foundColumnMapping.name);
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
