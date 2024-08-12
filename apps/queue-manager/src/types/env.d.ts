declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface ProcessEnv {
    MONGO_URL: string;
    RABBITMQ_CONN_URL: string;
    API_ROOT_URL: string;
    S3_LOCAL_STACK: string;
    S3_REGION: string;
    S3_BUCKET_NAME: string;

    PAYMENT_API_BASE_URL: string;
    PAYMENT_AUTH_KEY: string;
    PAYMENT_AUTH_VALUE: string;

    SENTRY_DSN: string;
  }
}
