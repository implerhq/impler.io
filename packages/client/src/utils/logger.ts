import { TEXTS } from '../config';

export const logError = (key: keyof typeof TEXTS) => {
  // eslint-disable-next-line no-console
  console.error(TEXTS[key]);
};
