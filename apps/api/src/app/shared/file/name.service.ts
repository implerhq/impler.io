import * as path from 'path';

export class FileNameService {
  getSampleFileName(templateId: string): string {
    return `${templateId}/sample.csv`;
  }
  getSampleFileUrl(templateId: string): string {
    const fileName = this.getSampleFileName(templateId);

    return path.join(process.env.S3_LOCAL_STACK, process.env.S3_BUCKET_NAME, fileName);
  }
}
