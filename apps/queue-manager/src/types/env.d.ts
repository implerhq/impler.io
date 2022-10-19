declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface ProcessEnv {
    MONGO_URL: string;
    RABBITMQ_CONN_URL: string;
    S3_LOCAL_STACK: string;
    S3_REGION: string;
    S3_BUCKET_NAME: string;
  }
}
