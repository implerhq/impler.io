declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface ProcessEnv {
    NODE_ENV: 'test' | 'prod' | 'dev' | 'ci' | 'local';
    PORT: number;
    API_ROOT_URL: string;
    FRONT_BASE_URL: string;

    MONGO_URL: string;
    S3_LOCAL_STACK: string;
    S3_REGION: string;
    S3_BUCKET_NAME: string;
  }
}
