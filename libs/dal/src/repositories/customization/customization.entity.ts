export class CustomizationEntity {
  _id?: string;

  _templateId: string;

  recordVariables: string[];

  chunkVariables: string[];

  recordFormat: string;

  chunkFormat: string;

  combinedFormat: string;

  isRecordFormatUpdated: boolean;

  isChunkFormatUpdated: boolean;

  isCombinedFormatUpdated: boolean;
}
