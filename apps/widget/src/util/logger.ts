/* eslint-disable no-console */
export enum ErrorTypesEnum {
  INVALID_PROPS = 'INVALID_PROPS',
  INVALID_COLOR = 'INVALID_COLOR',
}
export function logError(type: ErrorTypesEnum, message: string) {
  console.error(`[${type}] ${message}`);
}
