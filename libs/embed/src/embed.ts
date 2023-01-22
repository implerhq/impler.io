/* eslint no-undef: 0 */
/* eslint promise/param-names: 0 */
/* eslint-disable */
//

import { EventTypesEnum } from './shared/eventTypes';
import { UnmountedError, AuthenticationError } from './shared/errors';
import { IFRAME_URL } from './shared/resources';

const WEASL_WRAPPER_ID = 'impler-container';
const IFRAME_ID = 'impler-iframe-element';
const WRAPPER_CLASS_NAME = 'wrapper-impler-widget';

class Impler {
  public projectId: string | unknown;

  private i18n?: Record<string, unknown>;

  private onloadFunc: (b: any) => void;

  private iframe: HTMLIFrameElement | undefined;

  private widgetVisible = false;

  private listeners: { [key: string]: (data: any) => void } = {};

  private initPayload: any;

  private isAuthenticated: boolean = false;

  private authenticationError?: string;

  constructor(onloadFunc = function () {}) {
    this.onloadFunc = onloadFunc;
    this.widgetVisible = false;
  }

  on = (name: string, cb: (data: any) => void) => {
    this.listeners[name] = cb;
  };

  init = (projectId: string, payload: any) => {
    this.projectId = projectId;
    this.initPayload = payload;
    this.initializeIframe(projectId);
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
      elem.style.display = 'none';
    }
  };

  showWidget = (payload: any) => {
    this.ensureMounted();
    this.widgetVisible = !this.widgetVisible;
    var elem = document.querySelector(`.${WRAPPER_CLASS_NAME}`) as HTMLBodyElement;

    if (elem) {
      elem.style.display = 'inline-block';
    }

    this.iframe?.contentWindow?.postMessage(
      {
        type: EventTypesEnum.SHOW_WIDGET,
        value: payload,
      },
      '*'
    );
  };

  // PRIVATE METHODS
  ensureMounted = () => {
    if (!document.getElementById(IFRAME_ID)) {
      throw new UnmountedError('impler.init needs to be called first');
    } else if (!this.isAuthenticated) {
      throw new AuthenticationError(this.authenticationError || `You're not authenticated to access the widget`);
    }
  };

  receiveMessage = (event: any) => {
    if (!!event && !!event.data && !!event.data.type) {
      // eslint-disable-next-line default-case
      switch (event.data.type) {
        case EventTypesEnum.CLOSE_WIDGET:
          this.hideWidget();
          this.postMessageToContentWindow(event.data.type);
          break;
        case EventTypesEnum.AUTHENTICATION_VALID:
          this.isAuthenticated = true;
          this.authenticationError = undefined;
          break;
        case EventTypesEnum.AUTHENTICATION_ERROR:
          this.isAuthenticated = false;
          this.authenticationError = event.data.value?.message;
        default:
          this.postMessageToContentWindow(event.data.type, event.data.value);
      }
    }
  };

  postMessageToContentWindow(type: EventTypesEnum, value?: any): void {
    this.listeners['message']({ type, value });
  }

  initializeIframe = (projectId: string) => {
    if (!document.getElementById(IFRAME_ID)) {
      const iframe = document.createElement('iframe');
      window.addEventListener(
        'message',
        (event) => {
          if (!event.target || event?.data?.type !== EventTypesEnum.WIDGET_READY) {
            return;
          }

          iframe?.contentWindow?.postMessage({ type: EventTypesEnum.INIT_IFRAME, value: this.initPayload }, '*');
        },
        true
      );

      iframe.style.backgroundColor = 'transparent';
      iframe.src = `${IFRAME_URL}/${projectId}?`;
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
    }
  };

  runPriorCalls = () => {
    const allowedCalls: string[] = [];
    const priorCalls =
      window.impler && window.impler._c && typeof window.impler._c === 'object' ? window.impler._c : [];
    priorCalls.forEach((call: string[]) => {
      const method: any = call[0];
      const args = call[1];
      if (allowedCalls.includes(method)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (this[method as any] as any).apply(this, args);
      }
    });
    this.onloadFunc.call(window.impler, window.impler);
  };

  mountIframe = () => {
    if (!document.getElementById(IFRAME_ID) && this.iframe) {
      window.addEventListener('message', this.receiveMessage, false);

      const wrapper = document.createElement('div');

      wrapper.className = WRAPPER_CLASS_NAME;
      wrapper.style.display = 'none';
      wrapper.id = WEASL_WRAPPER_ID;
      (
        wrapper as any
      ).style = `z-index: ${Number.MAX_SAFE_INTEGER}; width: 0; height: 0; position: relative; display: none;`;
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
})(window);
