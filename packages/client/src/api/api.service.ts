import {
  HttpClient,
  IUpload,
  IMapping,
  IMappingFinalize,
  IReviewData,
  ITemplate,
  PaginationResult,
} from '@impler/shared';

export class ApiService {
  private httpClient: HttpClient;

  isAuthenticated = false;

  constructor(private backendUrl: string) {
    this.httpClient = new HttpClient(backendUrl);
  }

  constructQueryString(obj: Record<string, string | number>): string {
    const arr = [];
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] !== undefined && obj[key] !== null)
        arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    });
    const query = arr.join('&');

    return query ? `?${query}` : '';
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
    }) as Promise<IUpload>;
  }

  async getTemplates(projectId: string): Promise<ITemplate[]> {
    return this.httpClient.get(`/template/${projectId}`) as Promise<
      ITemplate[]
    >;
  }

  async getMappings(uploadId: string): Promise<IMapping[]> {
    return this.httpClient.get(`/mapping/${uploadId}`) as Promise<IMapping[]>;
  }

  async finalizeMappings(uploadId: string, mappings: IMappingFinalize[]) {
    return this.httpClient.post(
      `/mapping/${uploadId}/finalize`,
      mappings
    ) as Promise<IUpload>;
  }

  async getReviewData(
    uploadId: string,
    page?: number,
    limit?: number
  ): Promise<IReviewData> {
    const queryString = this.constructQueryString({ limit, page });

    return this.httpClient.get(
      `/review/${uploadId}${queryString}`
    ) as Promise<IReviewData>;
  }

  async confirmReview(uploadId: string, processInvalidRecords?: boolean) {
    return this.httpClient.post(`/review/${uploadId}/confirm`, {
      processInvalidRecords,
    }) as Promise<IUpload>;
  }

  async getUpload(uploadId: string) {
    return this.httpClient.get(`/upload/${uploadId}`) as Promise<IUpload>;
  }

  async getValidUploadedRows(uploadId: string, page: number, limit: number) {
    return this.httpClient.get(
      `/upload/${uploadId}/rows/valid?page=${page}&limit=${limit}`
    ) as Promise<PaginationResult>;
  }

  async getInvalidUploadedRows(uploadId: string, page: number, limit: number) {
    return this.httpClient.get(
      `/upload/${uploadId}/rows/invalid?page=${page}&limit=${limit}`
    ) as Promise<PaginationResult>;
  }
}
