import { EventTypesEnum } from '@types';

export function Ready() {
  window.parent.postMessage({ type: EventTypesEnum.WIDGET_READY }, '*');
}
export function Close() {
  window.parent.postMessage({ type: EventTypesEnum.CLOSE_WIDGET }, '*');
}
export function AuthenticationValid() {
  window.parent.postMessage({ type: EventTypesEnum.AUTHENTICATION_VALID }, '*');
}
export function AuthenticationError(message: string) {
  window.parent.postMessage({ type: EventTypesEnum.AUTHENTICATION_ERROR, value: { message } }, '*');
}
