import { DestinationsEnum } from '../../types/destination/destination.types';

export interface ICustomization {
  _id: string;
  _templateId: string;
  destination: DestinationsEnum;
  recordVariables: string[];
  chunkVariables: string[];
  recordFormat: string;
  chunkFormat: string;
  combinedFormat: string;
  isCombinedFormatUpdated: boolean;
  isRecordFormatUpdated: boolean;
  isChunkFormatUpdated: boolean;
}
