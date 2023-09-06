export class AddUploadEntryCommand {
  _templateId: string;

  _allDataFileId?: string;

  _uploadedFileId: string;

  uploadId: string;

  extra?: string;

  authHeaderValue?: string;

  headings?: string[];

  totalRecords?: number;

  schema?: string;
}
