import { EventTypesEnum } from '@impler/shared';

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
export function UploadStarted(value: { uploadId: string; templateId: string }) {
  window.parent.postMessage({ type: EventTypesEnum.UPLOAD_STARTED, value }, '*');
}
export function UploadTerminated(value: { uploadId: string }) {
  window.parent.postMessage({ type: EventTypesEnum.UPLOAD_TERMINATED, value }, '*');
}
export function UploadCompleted(value: { uploadId: string }) {
  window.parent.postMessage({ type: EventTypesEnum.UPLOAD_COMPLETED, value }, '*');
}
