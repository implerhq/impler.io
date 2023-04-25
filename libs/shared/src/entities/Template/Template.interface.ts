export interface ITemplate {
  _id: string;
  name: string;
  callbackUrl: string;
  chunkSize: number;
  sampleFileUrl: string;
  _projectId: string;
  totalUploads: number;
  totalRecords: number;
  totalInvalidRecords: number;
}
