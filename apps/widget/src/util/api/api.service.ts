import {
  IMapping,
  IReplaceData,
  IMappingFinalize,
  IReviewData,
  ITemplate,
  PaginationResult,
  IImportConfig,
  ISchemaColumn,
  IRecord,
  constructQueryString,
  IUserJobMapping,
  IUserJob,
  IColumn,
  ISetHeaderData,
} from '@impler/shared';
import { IUpload } from '@impler/client';
import { HttpClient } from './api.client';

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

  async checkIsRequestvalid(projectId: string, templateId?: string, schema?: string) {
    return this.httpClient.post(`/common/valid`, {
      projectId,
      templateId,
      schema,
    });
  }

  async getImportConfig(projectId: string, templateId?: string) {
    return this.httpClient.get(`/common/import-config`, {
      projectId,
      templateId,
    }) as Promise<IImportConfig>;
  }

  async getExcelSheetNames(data: { file: File }) {
    const formData = new FormData();
    formData.append('file', data.file);

    return this.httpClient.post(`/common/sheet-names`, formData, {
      'Content-Type': 'multipart/form-data',
    }) as Promise<string[]>;
  }

  async uploadFile(data: {
    templateId: string;
    file?: File;
    authHeaderValue?: string;
    extra?: string;
    schema?: string;
    output?: string;
    importId?: string;
    imageSchema?: string;
    selectedSheetName?: string;
  }) {
    const formData = new FormData();
    if (data.file) formData.append('file', data.file);
    if (data.authHeaderValue) formData.append('authHeaderValue', data.authHeaderValue);
    if (data.extra) formData.append('extra', data.extra);
    if (data.schema) formData.append('schema', data.schema);
    if (data.output) formData.append('output', data.output);
    if (data.selectedSheetName) formData.append('selectedSheetName', data.selectedSheetName);
    if (data.importId) formData.append('importId', data.importId);
    if (data.imageSchema) formData.append('imageSchema', data.imageSchema);

    return this.httpClient.post(
      `/upload/${data.templateId}`,
      formData,
      data.file
        ? {
            'Content-Type': 'multipart/form-data',
          }
        : {}
    ) as Promise<IUpload>;
  }

  async getTemplates(projectId: string): Promise<ITemplate[]> {
    return this.httpClient.get(`/project/${projectId}/templates`) as Promise<ITemplate[]>;
  }

  async getMappings(uploadId: string): Promise<IMapping[]> {
    return this.httpClient.get(`/mapping/${uploadId}`) as Promise<IMapping[]>;
  }

  async finalizeMappings(uploadId: string, mappings: IMappingFinalize[]) {
    return this.httpClient.post(`/mapping/${uploadId}/finalize`, mappings) as Promise<IUpload>;
  }

  async doReivewData(uploadId: string) {
    return this.httpClient.post(`/review/${uploadId}`);
  }

  async getReviewData({
    uploadId,
    page,
    limit,
    type,
  }: {
    uploadId: string;
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<IReviewData> {
    const queryString = constructQueryString({ limit, page, type });

    return this.httpClient.get(`/review/${uploadId}${queryString}`) as Promise<IReviewData>;
  }

  async confirmReview(uploadId: string) {
    return this.httpClient.post(`/review/${uploadId}/confirm`) as Promise<{
      email: string;
      uploadInfo: IUpload;
      importedData: Record<string, any>[];
    }>;
  }

  async getUpload(uploadId: string) {
    return this.httpClient.get(`/upload/${uploadId}`) as Promise<IUpload>;
  }

  async getDataPreview(uploadId: string) {
    return this.httpClient.get(`/upload/${uploadId}/preview`) as Promise<string[][]>;
  }

  async setHeaderRow(uploadId: string, data: ISetHeaderData) {
    return this.httpClient.put(`/upload/${uploadId}/header`, data) as Promise<IUpload>;
  }

  async terminateUpload(uploadId: string) {
    return this.httpClient.delete(`/upload/${uploadId}`) as Promise<IUpload>;
  }

  async getTemplateColun(templateId: string) {
    return this.httpClient.get(`/template/${templateId}/columns`) as Promise<IColumn[]>;
  }

  async getColumns(uploadId: string) {
    return this.httpClient.get(`/upload/${uploadId}/columns`) as Promise<ISchemaColumn[]>;
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

  async getSignedUrl(key: string) {
    return this.httpClient.post(`/common/signed-url`, {
      key,
    }) as Promise<string>;
  }

  async downloadSample(templateId: string, data: FormData) {
    return this.httpClient.post(`/template/${templateId}/sample`, data, {}, 'blob') as Promise<ArrayBuffer>;
  }

  async updateRecord(uploadId: string, record: Partial<IRecord>) {
    return this.httpClient.put(`/review/${uploadId}/record`, record) as Promise<IRecord>;
  }

  async updateRecords(uploadId: string, records: Partial<IRecord>[]) {
    return this.httpClient.put(`/review/${uploadId}/records`, records) as Promise<IRecord[]>;
  }

  async deleteRecord(uploadId: string, indexes: number[], valid: number, invalid: number) {
    return this.httpClient.post(`/review/${uploadId}/delete-records`, {
      indexes,
      valid,
      invalid,
    });
  }

  async replace(uploadId: string, data: IReplaceData) {
    return this.httpClient.put(`/review/${uploadId}/replace`, data) as Promise<IReplaceResponse>;
  }

  async getRssXmlMappingHeading(data: {
    templateId: string;
    url: string;
    authHeaderValue?: string;
    extra?: string;
    schema?: string;
    output?: string;
  }) {
    return this.httpClient.post(`/import-jobs/${data.templateId}`, {
      url: data.url,
      authHeaderValue: data.authHeaderValue,
      extra: data.extra,
      schema: data.schema,
      output: data.output,
    });
  }

  async getUserJobMappings(jobId: string) {
    return this.httpClient.get(`/import-jobs/${jobId}/mappings`) as Promise<IUserJobMapping[]>;
  }

  async createUserJobMapings(jobId: string, mappings: IUserJobMapping[]) {
    return this.httpClient.put(`/import-jobs/${jobId}/mappings`, mappings) as Promise<IUserJobMapping[]>;
  }

  async updateUserJob(jobId: string, userJobData: Partial<IUserJob>) {
    return this.httpClient.put(`/import-jobs/${jobId}`, userJobData) as Promise<IUserJob>;
  }
}
