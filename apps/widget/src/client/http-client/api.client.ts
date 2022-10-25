import axios, { AxiosInstance } from 'axios';

export interface IParamObject {
  [key: string]: string | string[] | number | boolean;
}

export class HttpClient {
  private axiosClient: AxiosInstance;

  constructor(private backendUrl: string) {
    this.axiosClient = axios.create({
      baseURL: backendUrl + '/v1',
    });
  }

  async get(url: string, params?: IParamObject) {
    return await this.axiosClient
      .get(url, {
        params,
      })
      .then((response) => response.data.data);
  }

  async post(url: string, body = {}) {
    return await this.axiosClient.post(url, body).then((response) => response.data.data);
  }

  async patch(url: string, body = {}) {
    return await this.axiosClient.patch(url, body).then((response) => response.data.data);
  }

  async delete(url: string) {
    return await this.axiosClient.delete(url).then((response) => response.data.data);
  }
}
