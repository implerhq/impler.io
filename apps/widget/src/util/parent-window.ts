export function Ready() {
  window.parent.postMessage({ type: 'WIDGET_READY' }, '*');
}
export function Close() {
  window.parent.postMessage({ type: 'CLOSE_WIDGET' }, '*');
}
export function AuthenticationValid() {
  window.parent.postMessage({ type: 'AUTHENTICATION_VALID' }, '*');
}
export function AuthenticationError(message: string) {
  window.parent.postMessage({ type: 'AUTHENTICATION_ERROR', value: { message } }, '*');
}
