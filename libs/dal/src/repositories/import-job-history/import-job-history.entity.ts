export class ImportJobHistoryEntity {
  _id: string;

  _jobId: string;

  validFileId: string;

  invalidFileId: string;

  allDataFileId: string;

  fetchStatus: string;

  status: string;

  runOn: Date;
}
