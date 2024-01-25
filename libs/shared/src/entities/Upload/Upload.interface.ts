export interface IUpload {
  _id: string;
  _templateId: string;
  _uploadedFileId: string;
  _allDataFileId: string;
  _validDataFileId: string;
  _invalidDataFileId: string;
  invalidCSVDataFileUrl: string;
  originalFileName: string;
  originalFileType: string;
  headings: string[];
  uploadedDate: Date;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  authHeaderValue: string;
  status: string;
  extra: string;
  __v: number;
  processInvalidRecords: boolean;
  customRecordFormat: string;
  customChunkFormat: string;
}
