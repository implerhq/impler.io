export function Ready() {
  window.parent.postMessage({ type: 'WIDGET_READY' }, '*');
}
export function Close() {
  window.parent.postMessage({ type: 'CLOSE_WIDGET' }, '*');
}
