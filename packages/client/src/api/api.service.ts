import { HttpClient, ITemplate } from '@impler/shared';

export class ApiService {
  private httpClient: HttpClient;

  isAuthenticated = false;

  constructor(private backendUrl: string) {
    this.httpClient = new HttpClient(backendUrl);
  }

  setAuthorizationToken(token: string) {
    this.httpClient.setAuthorizationToken(token);

    this.isAuthenticated = true;
  }

  disposeAuthorizationToken() {
    this.httpClient.disposeAuthorizationToken();

    this.isAuthenticated = false;
  }

  async checkIsRequestvalid(projectId: string, template?: string) {
    return this.httpClient.post(`/common/valid`, { projectId, template });
  }

  async uploadFile(data: {
    template: string;
    file: File;
    authHeaderValue?: string;
    extra?: string;
  }) {
    const formData = new FormData();
    formData.append('file', data.file);
    if (data.authHeaderValue)
      formData.append('authHeaderValue', data.authHeaderValue);
    if (data.extra) formData.append('extra', data.extra);

    return this.httpClient.post(`/upload/${data.template}`, formData, {
      'Content-Type': 'multipart/form-data',
    });
  }

  async getTemplates(projectId: string): Promise<ITemplate[]> {
    return this.httpClient.get(`/template/${projectId}`) as Promise<
      ITemplate[]
    >;
  }
}
