export class AddUploadEntryCommand {
  _templateId: string;

  _allDataFileId?: string;

  _uploadedFileId?: string;

  uploadId: string;

  extra?: string;

  authHeaderValue?: string;

  headings?: string[];

  schema?: string;

  originalFileName?: string;

  originalFileType?: string;

  customRecordFormat: string;

  customChunkFormat: string;
}
