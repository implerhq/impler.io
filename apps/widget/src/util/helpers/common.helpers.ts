import axios from 'axios';
import * as Sentry from '@sentry/react';
import { variables } from '@config';
import { downloadFile } from '@impler/shared';

// eslint-disable-next-line no-magic-numbers
export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const KBSize = 1024;
  // eslint-disable-next-line no-magic-numbers
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(KBSize));

  return `${parseFloat((bytes / Math.pow(KBSize, i)).toFixed(dm))} ${sizes[i]}`;
}

function isValidHttpUrl(string: string) {
  let url: URL | undefined;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

function fetchFile(urlToFetch: string, name: string) {
  axios({
    url: urlToFetch,
    method: 'GET',
    // headers: headers,
    responseType: 'blob', // important
  }).then((response) => {
    downloadFile(new Blob([response.data]), name);

    return response;
  });
}

export function downloadFileFromURL(url: string, name: string) {
  if (!isValidHttpUrl(url)) return;

  fetchFile(url, name);
}

export function getFileNameFromUrl(url: string) {
  if (!isValidHttpUrl(url)) return '';
  const formedUrl = new URL(url);
  let pathArr = formedUrl.pathname.split('/');
  pathArr = pathArr.splice(variables.secondIndex);

  return pathArr.join('/');
}

export function captureError(error: any) {
  if (Sentry.isInitialized()) Sentry.captureException(error);
  else console.error(error);
}

export const getObjectId = (math = Math, date = Date, hr = 16, sec = (sp: number) => math.floor(sp).toString(hr)) =>
  sec(date.now() / 1000) + ' '.repeat(hr).replace(/./g, () => sec(math.random() * hr));
