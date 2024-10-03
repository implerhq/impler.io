import { isBrowser } from '@impler/shared';

export const API_URL =
  isBrowser() && (window as any).Cypress
    ? window._env_?.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:1336'
    : window._env_?.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const SENTRY_DSN = window._env_?.REACT_APP_SENTRY_DSN || process.env.REACT_APP_SENTRY_DSN || undefined;

export const AMPLITUDE_ID = window._env_?.REACT_APP_AMPLITUDE_ID || process.env.REACT_APP_AMPLITUDE_ID || undefined;

export const ENV = window._env_?.REACT_APP_ENVIRONMENT || process.env.REACT_APP_ENVIRONMENT || 'local';

export const HANDSONTABLE_LICENSE_KEY =
  window._env_?.REACT_APP_HANDSONTABLE_LICENSE_KEY ||
  process.env.REACT_APP_HANDSONTABLE_LICENSE_KEY ||
  'non-commercial-and-evaluation';

export const CONTEXT_PATH = '';

export const MANUAL_ENTRY_LIMIT =
  window._env_?.REACT_APP_MANUAL_ENTRY_LIMIT || process.env.REACT_APP_MANUAL_ENTRY_LIMIT || 10000;
