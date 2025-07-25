import { IUserShowPayload } from '@impler/shared';
import { EventTypesEnum, WidgetEventTypesEnum } from '@impler/shared';
import { Socket } from 'socket.io-client';

export type MessageHandlerDataType =
  | {
      type: EventTypesEnum.INIT_IFRAME;
    }
  | {
      type: WidgetEventTypesEnum.SHOW_WIDGET;
      value: IUserShowPayload;
    }
  | {
      type: WidgetEventTypesEnum.CLOSE_WIDGET;
    };

export enum PromptModalTypesEnum {
  'CLOSE' = 'CLOSE',
  'UPLOAD_AGAIN' = 'UPLOAD_AGAIN',
}

export enum PhasesEnum {
  VALIDATE = 0,

  IMAGE_UPLOAD = 1,
  UPLOAD = 2,
  SELECT_HEADER = 3,
  MAPPING = 4,
  REVIEW = 5,
  COMPLETE = 6,

  CONFIGURE = 1,
  MAPCOLUMNS = 2,
  SCHEDULE = 3,
  CONFIRM = 4,

  MANUAL_ENTRY = 1,
  SUBMIT = 2,
}

export interface IFormvalues {
  file: File;
  templateId: string;
  selectedSheetName?: string;
}

export interface IUploadValues extends IFormvalues {
  authHeaderValue?: string;
  extra?: string;
  schema?: string;
  output?: string;
  importId?: string;
  imageSchema?: string;
  maxRecords?: number;
}

export interface IAutoImportValues {
  webSocketSessionId: string;
  url: string;
  templateId: string;
  authHeaderValue?: string;
  extra?: string;
  schema?: string;
  output?: string;
}

export type RecurrenceFormData = {
  recurrenceType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dailyType: 'every' | 'weekdays';
  dailyFrequency: number;
  frequency: number;
  selectedDays?: string[];
  time: string;
  endsNever: boolean;
  endsOn?: Date;
  monthlyType?: 'onDay' | 'onThe';
  consecutiveMonths: any;
  monthlyDayNumber?: number;
  monthlyDayPosition?: string;
  monthlyDayOfWeek?: string;
  yearlyMonth?: string;
  yearlyType?: 'onDay' | 'onThe';
  yearlyDayNumber?: number;
  yearlyDayPosition?: string;
  yearlyDayOfWeek?: string;
};

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

export interface ICompletionData {
  sessionId: string;
  result: any;
  timestamp: string;
}

export interface IErrorData {
  sessionId: string;
  error: string;
  timestamp: string;
}

export interface ISessionAbortedData {
  sessionId: string;
  message: string;
  timestamp: string;
}

export interface UseWebSocketProgressOptions {
  serverUrl?: string;
  autoConnect?: boolean;
  onProgress?: (data: IProgressData) => void;
  onCompletion?: (data: ICompletionData) => void;
  onError?: (data: IErrorData) => void;
  onConnectionChange?: (connected: boolean) => void;
  onSessionAborted?: (data: ISessionAbortedData) => void;
}

export interface UseWebSocketProgressReturn {
  socket: Socket | null;
  isConnected: boolean;
  progressData: IProgressData | null;
  completionData: ICompletionData | null;
  errorData: IErrorData | null;
  abortedData: ISessionAbortedData | null;
  joinSession: (sessionId: string) => void;
  leaveSession: (sessionId: string) => void;
  abortSession: (sessionId: string) => void;
  clearProgress: () => void;
  connect: () => void;
  disconnect: () => void;
}
