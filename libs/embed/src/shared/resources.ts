let ResourcesConstants: {
  API_URL: string;
  IFRAME_URL?: string;
  WWW_URL?: string;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === '') {
  ResourcesConstants = {
    API_URL: '',
    IFRAME_URL: process.env.WIDGET_URL,
    WWW_URL: process.env.WIDGET_URL,
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} else if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === 'dev') {
  ResourcesConstants = {
    API_URL: '',
    IFRAME_URL: process.env.WIDGET_URL || 'http://localhost:3500',
    WWW_URL: process.env.WIDGET_URL || 'http://localhost:3500',
  };
} else {
  ResourcesConstants = {
    API_URL: '',
    IFRAME_URL: process.env.WIDGET_URL || 'http://localhost:3500',
    WWW_URL: process.env.WIDGET_URL || 'http://localhost:3500',
  };
}

export const DEBUG = false;
export const { API_URL } = ResourcesConstants;
export const { IFRAME_URL } = ResourcesConstants;
export const { WWW_URL } = ResourcesConstants;
