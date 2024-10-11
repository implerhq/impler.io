import { IntegrationEnum } from '../../types';

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
  imageColumns: string[];
  totalInvalidRecords: number;
  mode: string;
  integration: IntegrationEnum;
}

export interface IImport {
  _id: string;
  name: string;
  totalUploads: number;
  totalRecords: number;
  totalInvalidRecords: number;
}
