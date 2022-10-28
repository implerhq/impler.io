/* eslint no-undef: 0 */
/* eslint promise/param-names: 0 */
/* eslint-disable */
//

import * as EventTypes from './shared/eventTypes';
import { UnmountedError, DomainVerificationError } from './shared/errors';
import { IFRAME_URL } from './shared/resources';

const WEASL_WRAPPER_ID = 'impler-container';
const IFRAME_ID = 'impler-iframe-element';
const WRAPPER_CLASS_NAME = 'wrapper-impler-widget';

class Impler {
  public projectId: string | unknown;

  private i18n?: Record<string, unknown>;

  private debugMode: boolean;

  private onloadFunc: (b: any) => void;

  private domainAllowed: boolean;

  private selector: string = '';

  private options?: IOptions;

  private iframe: HTMLIFrameElement | undefined;

  private widgetVisible = false;

  private listeners: { [key: string]: (data: any) => void } = {};

  constructor(onloadFunc = function () {}) {
    this.debugMode = false;
    this.onloadFunc = onloadFunc;
    this.domainAllowed = true;
    this.widgetVisible = false;
  }

  on = (name: string, cb: (data: any) => void) => {
    this.listeners[name] = cb;
  };

  init = (
    projectId: string,
    selectorOrOptions: string | IOptions,
    data: { subscriberId: string; lastName: string; firstName: string; email: string; subscriberHash?: string }
  ) => {
    const _scope = this;
    if (typeof selectorOrOptions === 'string') {
      this.selector = selectorOrOptions;
    } else {
      this.selector = selectorOrOptions.selector;
      this.options = selectorOrOptions;
      this.i18n = selectorOrOptions.i18n;
    }

    this.projectId = projectId;
    this.initializeIframe(projectId, data);
    this.mountIframe();
    const button = document.querySelector(this.selector) as HTMLButtonElement;
    if (button) {
      button.style.position = 'relative';
    }

    const _this = this;
    function positionIframe() {
      const button = document.querySelector(_scope.selector);
      if (!button) {
        return;
      }
      const pos = button.getClientRects()[0];
      if (!pos) {
        hideWidget();
        return;
      }

      const wrapper: any = document.querySelector(`.${WRAPPER_CLASS_NAME}`);

      wrapper.style.position = 'absolute';
      wrapper.style.height = '100vh';
      wrapper.style.width = '100vw';
      wrapper.style.top = '0';
      wrapper.style.left = '0';
    }

    function hideWidget() {
      var elem = document.querySelector(`.${WRAPPER_CLASS_NAME}`) as HTMLBodyElement;

      if (elem) {
        elem.style.display = 'none';
      }
    }

    function handleClick(e: MouseEvent | TouchEvent) {
      if (document.querySelector(_scope.selector)?.contains(e.target as Node) && projectId) {
        _scope.widgetVisible = !_scope.widgetVisible;
        positionIframe();

        var elem = document.querySelector(`.${WRAPPER_CLASS_NAME}`) as HTMLBodyElement;

        if (elem) {
          elem.style.display = 'inline-block';
        }

        _scope.iframe?.contentWindow?.postMessage(
          {
            type: EventTypes.SHOW_WIDGET,
            value: {},
          },
          '*'
        );
      } else {
        // hideWidget();
      }
    }

    window.addEventListener('resize', positionIframe);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick);
  };

  // PRIVATE METHODS
  ensureMounted = () => {
    if (!document.getElementById(IFRAME_ID)) {
      throw new UnmountedError('impler.init needs to be called first');
    }
  };

  ensureAllowed = () => {
    if (!this.domainAllowed) {
      throw new DomainVerificationError(`${window.location.host} is not permitted to use client ID ${this.projectId}`);
    }
  };

  receiveMessage = (event: any) => {
    if (!!event && !!event.data && !!event.data.type) {
      // eslint-disable-next-line default-case
      switch (event.data.type) {
        case EventTypes.SET_COOKIE:
          document.cookie = event.data.value;
          break;
        case EventTypes.DOMAIN_NOT_ALLOWED:
          this.handleDomainNotAllowed();
          break;
        case EventTypes.BOOTSTRAP_DONE:
          this.handleBootstrapDone();
          break;
      }
    }
  };

  handleBootstrapDone = () => {
    const implerApi = (window as any).impler;
    implerApi._c = (window as any).impler._c;

    this.runPriorCalls();
    (window as any).impler = implerApi;
  };

  handleDomainNotAllowed = () => {
    this.domainAllowed = false;
  };

  initializeIframe = (projectId: string, options: any) => {
    if (!document.getElementById(IFRAME_ID)) {
      const iframe = document.createElement('iframe');
      window.addEventListener(
        'message',
        (event) => {
          if (!event.target || event?.data?.type !== EventTypes.WIDGET_READY) {
            return;
          }

          iframe?.contentWindow?.postMessage(
            {
              type: EventTypes.INIT_IFRAME,
              value: {
                projectId: this.projectId,
                i18n: this.i18n,
                topHost: window.location.host,
                data: options,
              },
            },
            '*'
          );
        },
        true
      );

      iframe.src = `${IFRAME_URL}/${projectId}?`;
      iframe.id = IFRAME_ID;
      iframe.style.border = 'none';
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

  const initCall = window.impler._c.find((call: string[]) => call[0] === 'init');
  const implerApi: any = () => {};
  const impler = new Impler(onloadFunc);

  implerApi.init = impler.init;
  implerApi.on = impler.on;

  if (initCall) {
    // eslint-disable-next-line prefer-spread
    implerApi[initCall[0]].apply(implerApi, initCall[1]);

    const onCalls = window.impler._c.filter((call: string[]) => call[0] === 'on');
    if (onCalls.length) {
      for (const onCall of onCalls) {
        implerApi[onCall[0]].apply(implerApi, onCall[1]);
      }
    }
  } else {
    // eslint-disable-next-line no-param-reassign
    (window as any).impler.init = impler.init;

    // eslint-disable-next-line no-param-reassign
    (window as any).impler.on = impler.on;
  }
})(window);

interface IOptions {
  selector: string;
  i18n?: Record<string, unknown>;
}
