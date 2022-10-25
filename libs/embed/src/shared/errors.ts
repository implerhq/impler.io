/* eslint-disable @typescript-eslint/no-explicit-any */
export class UnmountedError extends Error {
  constructor(message = '', ...args: any) {
    super(message, ...(args as []));
    this.name = 'UnmountedError';
    this.message = message;
  }
}

export class ResponseError extends Error {
  data: any;
  constructor(message = '', data = {}, ...args: any) {
    super(message, ...(args as []));
    this.name = 'ResponseError';
    this.message = message;
    this.data = data;
  }
}

export class DomainVerificationError extends Error {
  constructor(message = '', ...args: any) {
    super(message, ...(args as []));
    this.name = 'DomainVerificationError';
    this.message = message;
  }
}
