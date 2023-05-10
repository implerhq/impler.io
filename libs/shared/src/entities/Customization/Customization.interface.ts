export interface ICustomization {
  _id: string;
  _templateId: string;
  recordVariables: string[];
  chunkVariables: string[];
  recordFormat: string;
  chunkFormat: string;
  isRecordFormatUpdated: boolean;
  isChunkFormatUpdated: boolean;
}
