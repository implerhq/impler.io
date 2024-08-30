interface IMessagePayload {
  type: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

declare interface Window {
  impler: any;
  parentIFrame: {
    sendMessage: (payload: IMessagePayload) => void;
  };
}
