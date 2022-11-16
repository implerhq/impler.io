import { isBrowser } from '@impler/shared';
import { getContextPath, ImplerComponentEnum } from '@impler/shared';

export const API_URL =
  isBrowser() && (window as any).Cypress
    ? window._env_?.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:1336'
    : window._env_?.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const SENTRY_DSN = window._env_?.REACT_APP_API_URL || process.env.REACT_APP_SENTRY_DSN || undefined;

export const ENV = window._env_?.REACT_APP_ENVIRONMENT || process.env.REACT_APP_SENTRY_DSN || 'local';

export const CONTEXT_PATH = getContextPath(ImplerComponentEnum.WIDGET);
