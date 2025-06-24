export enum StageEnum {
  FETCHING = 'fetching',
  PARSING = 'parsing',
  EXTRACTING = 'extracting',
  MAPPING = 'mapping',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface IProgressData {
  sessionId: string;
  percentage: number;
  stage: StageEnum;
}
