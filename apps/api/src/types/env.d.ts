declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface ProcessEnv {
    NODE_ENV: 'test' | 'prod' | 'dev' | 'ci' | 'local';
    PORT: number;
    ACCESS_KEY?: string;
    FRONT_BASE_URL: string;
    SENTRY_DSN: string;
    MONGO_URL: string;
    S3_LOCAL_STACK: string;
    S3_REGION: string;
    S3_BUCKET_NAME: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
  }
}
