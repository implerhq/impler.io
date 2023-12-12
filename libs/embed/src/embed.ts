/* eslint no-undef: 0 */
/* eslint promise/param-names: 0 */
/* eslint-disable */
//

import { EventTypesEnum } from './shared/eventTypes';
import { UnmountedError } from './shared/errors';
import { IFRAME_URL } from './shared/resources';

const WEASL_WRAPPER_ID = 'impler-container';
const IFRAME_ID = 'impler-iframe-element';
const WRAPPER_CLASS_NAME = 'wrapper-impler-widget';

class Impler {
  private projectId: string = '';

  private onloadFunc: (b: any) => void;

  private iframe: HTMLIFrameElement | undefined;

  private widgetVisible = false;

  private listeners: {
    [key: string]: { [key: string]: (data: any) => void };
  } = {};

  private initPayload: any;

  private activeWidgetId: string | undefined;

  private isWidgetReady: boolean = false;

  constructor(onloadFunc = function () {}) {
    this.onloadFunc = onloadFunc;
    this.widgetVisible = false;
  }

  on = (name: string, cb: (data: any) => void, id: string = '1') => {
    if (!this.listeners[id]) this.listeners[id] = {};
    this.listeners[id][name] = cb;
  };

  init = (widgetOrProjectId: string = '1', initPayload: { accessToken: string }) => {
    if (initPayload) {
      this.projectId = widgetOrProjectId;
      this.initPayload = initPayload;
    }
    this.initializeIframe(widgetOrProjectId);
    this.mountIframe();
  };

  positionIframe = () => {
    const wrapper: any = document.querySelector(`.${WRAPPER_CLASS_NAME}`);

    wrapper.style.position = 'absolute';
    wrapper.style.height = '100vh';
    wrapper.style.width = '100vw';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
  };

  hideWidget = () => {
    var elem = document.querySelector(`.${WRAPPER_CLASS_NAME}`) as HTMLBodyElement;

    if (elem) {
      elem.style.visibility = 'hidden';
    }
  };

  showWidget = (payload: any) => {
    this.ensureMounted();
    this.widgetVisible = !this.widgetVisible;
    var elem = document.querySelector(`.${WRAPPER_CLASS_NAME}`) as HTMLBodyElement;

    if (elem) {
      elem.style.visibility = 'visible';
    }
    if (payload.uuid) {
      this.activeWidgetId = payload.uuid;
    } else {
      this.activeWidgetId = '1';
    }

    this.iframe?.contentWindow?.postMessage(
      {
        type: EventTypesEnum.SHOW_WIDGET,
        value: {
          projectId: this.projectId,
          ...(this.initPayload || {}),
          ...payload,
          host: location.host,
        },
      },
      '*'
    );
  };

  isReady = () => this.isWidgetReady;

  // PRIVATE METHODS
  ensureMounted = () => {
    if (!document.getElementById(IFRAME_ID)) {
      throw new UnmountedError('impler.init needs to be called first');
    }
  };

  receiveMessage = (event: any) => {
    if (!!event && !!event.data && !!event.data.type) {
      // eslint-disable-next-line default-case
      switch (event.data.type) {
        case EventTypesEnum.WIDGET_READY:
          this.isWidgetReady = true;
          if (typeof this.listeners === 'object') {
            Object.keys(this.listeners).forEach((id) => {
              this.postMessageToContentWindow(EventTypesEnum.WIDGET_READY, id);
            });
          }
          break;
        case EventTypesEnum.CLOSE_WIDGET:
          this.hideWidget();
          this.postMessageToContentWindow(event.data.type, this.activeWidgetId!);
          break;
        default:
          this.postMessageToContentWindow(event.data.type, event.data.value);
      }
    }
  };

  postMessageToContentWindow(type: EventTypesEnum, id: string, value?: any): void {
    if (!this.listeners[id]?.['message']) {
      return;
    }
    this.listeners[id]['message']({ type, value });
  }

  initializeIframe = (id: string) => {
    let iframe: HTMLIFrameElement;
    if (!document.getElementById(IFRAME_ID)) {
      const iframe = document.createElement('iframe');

      iframe.style.backgroundColor = 'transparent';
      iframe.src = `${IFRAME_URL}/widget?id=${id}`;
      iframe.id = IFRAME_ID;
      iframe.style.border = 'none';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.style.overflow = 'hidden';
      iframe.style.zIndex = Number.MAX_SAFE_INTEGER.toString();
      (iframe as any).crossorigin = 'anonymous';
      this.iframe = iframe;
    } else {
      iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement;
      this.iframe = iframe;
    }
  };

  mountIframe = () => {
    if (!document.getElementById(IFRAME_ID) && this.iframe) {
      window.addEventListener('message', this.receiveMessage, false);

      const wrapper = document.createElement('div');

      wrapper.className = WRAPPER_CLASS_NAME;
      wrapper.style.visibility = 'hidden';
      wrapper.id = WEASL_WRAPPER_ID;
      wrapper.style.zIndex = String(Number.MAX_SAFE_INTEGER);
      wrapper.style.width = '0';
      wrapper.style.height = '0';
      wrapper.style.position = 'relative';
      wrapper.appendChild(this.iframe);
      document.body.appendChild(wrapper);
    }
  };
}

export default ((window: any) => {
  const onloadFunc =
    window.impler && window.impler.onload && typeof window.impler.onload === 'function'
      ? window.impler.onload
      : function () {};

  const impler = new Impler(onloadFunc);

  (window as any).impler = {};
  (window as any).impler.init = impler.init;
  (window as any).impler.on = impler.on;
  (window as any).impler.show = impler.showWidget;
  (window as any).impler.isReady = impler.isReady;
})(window);
