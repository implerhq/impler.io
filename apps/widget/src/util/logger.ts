/* eslint-disable no-console */
export enum ErrorTypesEnum {
  INVALID_PROPS = 'INVALID_PROPS',
}
export function logError(type: ErrorTypesEnum, message: string) {
  console.error(`[${type}] ${message}`);
}
