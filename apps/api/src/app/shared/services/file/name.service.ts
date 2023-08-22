export class FileNameService {
  getURLOrigin(): string {
    const url = new URL(process.env.S3_LOCAL_STACK);

    return url.origin;
  }
  getSampleFileName(templateId: string): string {
    return `${templateId}/sample.xlsx`;
  }
  getSampleFileUrl(templateId: string): string {
    const fileName = this.getSampleFileName(templateId);
    const origin = this.getURLOrigin();

    return [origin, process.env.S3_BUCKET_NAME, fileName].join('/');
  }
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
  }
  getUploadedFilePath(uploadId: string, fileName: string): string {
    return `${uploadId}/${this.getUploadedFileName(fileName)}`;
  }
  getUploadedFileName(fileName: string): string {
    return `uploaded.${this.getFileExtension(fileName)}`;
  }
  getAllJsonDataFileName(): string {
    return `all-data.json`;
  }
  getAllJsonDataFilePath(uploadId: string): string {
    return `${uploadId}/${this.getAllJsonDataFileName()}`;
  }
  getAllCSVDataFileName(): string {
    return `all-data.csv`;
  }
  getAllCSVDataFilePath(uploadId: string): string {
    return `${uploadId}/${this.getAllCSVDataFileName()}`;
  }
  getInvalidDataFileName(): string {
    return `invalid-data.json`;
  }
  getInvalidDataFilePath(uploadId: string): string {
    return `${uploadId}/${this.getInvalidDataFileName()}`;
  }
  getInvalidExcelDataFileName(): string {
    return 'invalid-data.xlsx';
  }
  getInvalidExcelDataFilePath(uploadId: string): string {
    return `${uploadId}/${this.getInvalidExcelDataFileName()}`;
  }
  getInvalidExcelDataFileUrl(uploadId: string): string {
    const path = this.getInvalidExcelDataFilePath(uploadId);
    const origin = this.getURLOrigin();

    return [origin, process.env.S3_BUCKET_NAME, path].join('/');
  }
  getValidDataFileName(): string {
    return `valid-data.json`;
  }
  getValidDataFilePath(uploadId: string): string {
    return `${uploadId}/${this.getValidDataFileName()}`;
  }
}
