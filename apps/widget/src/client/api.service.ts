import { HttpClient } from './http-client';

export class ApiService {
  private httpClient: HttpClient;

  isAuthenticated = false;

  constructor(private backendUrl: string) {
    this.httpClient = new HttpClient(backendUrl);
  }

  async getProjectTemplates(projectId: string) {
    return this.httpClient.get(`/template/${projectId}`);
  }
}
