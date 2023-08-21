export interface ITemplate {
  _id: string;
  name: string;
  callbackUrl?: string;
  authHeaderName?: string;
  chunkSize: number;
  sampleFileUrl?: string;
  _projectId: string;
  totalColumns: number;
  totalUploads: number;
  totalRecords: number;
  totalInvalidRecords: number;
}
