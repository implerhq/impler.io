/* eslint-disable multiline-comment-style */
import { AxiosError } from 'axios';

export class BubbleBaseService {
  createBubbleIoUrl(bubbleAppUrl: string): string {
    return bubbleAppUrl;
  }
  throwRequestError(errorWithType: AxiosError) {
    if ((errorWithType as AxiosError).response) {
      // Request made and server responded
      const response = errorWithType.response.data as Record<string, any>;
      if (response?.translation) throw new Error(response?.translation);
      else if (response.body?.message) throw new Error(response.body?.message);
      else if (response.includes('invalid appname hosted on bubbleapps.io')) throw new Error('Invalid App Name');
      else if (errorWithType.response.status === 401)
        throw new Error(`You're not authorized to access this app. Please check "App Name" or "API Private Key"`);
      console.log('response error', response, errorWithType.response);
    } else if ((errorWithType as AxiosError).request) {
      if (errorWithType.message.includes('ECONNRESET')) throw new Error('Cannot connect to app');
      if (errorWithType.message.includes('getaddrinfo'))
        throw new Error('Cannot connect to app. Please check "App Name" or "CustomDomain Name"');
      console.log('request error', errorWithType.message, errorWithType.request);
    } else {
      console.log('unknown error', errorWithType.message);
    }
    throw new Error(errorWithType.message);
  }
}
