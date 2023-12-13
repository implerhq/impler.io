/* eslint-disable @typescript-eslint/no-explicit-any */
export class UnmountedError extends Error {
  constructor(message = '', ...args: any) {
    super(message, ...(args as []));
    this.name = 'UnmountedError';
    this.message = message;
  }
}
