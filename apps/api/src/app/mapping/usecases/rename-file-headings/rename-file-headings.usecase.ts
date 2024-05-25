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

        const newHeadings = [...uploadInfo.headings];
        templateColumnItems.forEach((mapping) => {
          if (!mapping.columnHeading) {
            const headingIndex = newHeadings.findIndex((heading) => heading === mapping.key);
            if (headingIndex > -1) newHeadings[headingIndex] = '_';
          } else {
            const columnHeadingIndex = newHeadings.findIndex((heading) => heading === mapping.columnHeading);
            const keyHeadingIndex = newHeadings.findIndex((keyHeading) => keyHeading === mapping.key);
            if (keyHeadingIndex > -1 && columnHeadingIndex > -1) {
              [newHeadings[keyHeadingIndex], newHeadings[columnHeadingIndex]] = [
                newHeadings[columnHeadingIndex],
                newHeadings[keyHeadingIndex],
              ];
            } else if (columnHeadingIndex > -1) {
              newHeadings[columnHeadingIndex] = mapping.key;
            }
          }
        });

        return resolve({ headings: newHeadings });
      } catch (error) {
        reject(error);
      }
    });
  }
}
