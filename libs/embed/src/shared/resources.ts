let ResourcesConstants: {
  API_URL: string;
  IFRAME_URL?: string;
  WWW_URL?: string;
  SENTRY_DSN: string;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === '') {
  ResourcesConstants = {
    API_URL: '',
    IFRAME_URL: process.env.WIDGET_URL,
    WWW_URL: process.env.WIDGET_URL,
    SENTRY_DSN: '',
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} else if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === 'dev') {
  ResourcesConstants = {
    API_URL: '',
    IFRAME_URL: process.env.WIDGET_URL || 'http://localhost:3500',
    WWW_URL: process.env.WIDGET_URL || 'http://localhost:3500',
    SENTRY_DSN: '',
  };
} else {
  ResourcesConstants = {
    API_URL: '',
    IFRAME_URL: process.env.WIDGET_URL || 'http://localhost:3500',
    WWW_URL: process.env.WIDGET_URL || 'http://localhost:3500',
    SENTRY_DSN: '',
  };
}

export const DEBUG = false;
export const { API_URL } = ResourcesConstants;
export const { IFRAME_URL } = ResourcesConstants;
export const { WWW_URL } = ResourcesConstants;
export const { SENTRY_DSN } = ResourcesConstants;
