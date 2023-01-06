import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { ACCESS_KEY_NAME } from '../../config';

export interface IParamObject {
  [key: string]: string | string[] | number | boolean;
}

export interface IErrorObject {
  error: string;
  message: string;
  statusCode: number;
}

export class HttpClient {
  private axiosClient: AxiosInstance;

  constructor(private backendUrl: string) {
    this.axiosClient = axios.create({
      baseURL: backendUrl + '/v1',
    });
  }

  setAuthorizationToken(token: string) {
    this.axiosClient.defaults.headers.common[ACCESS_KEY_NAME] = token;
  }

  disposeAuthorizationToken() {
    delete this.axiosClient.defaults.headers.common[ACCESS_KEY_NAME];
  }

  async get(url: string, params?: IParamObject) {
    return this.callWrapper(this.axiosClient.get.bind(this, url, { params }));
  }

  async post(url: string, body = {}, headers: AxiosRequestHeaders = {}) {
    return this.callWrapper(this.axiosClient.post.bind(this, url, body, { headers }));
  }

  async patch(url: string, body = {}) {
    return this.callWrapper(this.axiosClient.patch.bind(this, url, body));
  }

  private callWrapper(axiosCall: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axiosCall();

        resolve(response.data);
      } catch (error) {
        if (error.response) {
          return reject(error.response.data as IErrorObject);
        } else if (error.request) {
          return reject(error.request);
        } else {
          return reject(error.message);
        }
      }
    });
  }
}
