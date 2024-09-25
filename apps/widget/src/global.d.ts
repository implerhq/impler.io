interface IMessagePayload {
  type: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

declare interface Window {
  parentIFrame: {
    sendMessage: (payload: IMessagePayload) => void;
  };
  _env_: any;
  amplitude?: any & {
    Identify: any;
  };
}

interface IOption {
  label: string;
  value: string;
}

interface IReplaceResponse {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedCount: number;
  matchedCount: number;
}
