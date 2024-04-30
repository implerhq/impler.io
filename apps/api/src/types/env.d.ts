declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface ProcessEnv {
    PORT: number;
    JWT_SECRET: string;
    NODE_ENV: 'test' | 'prod' | 'dev' | 'ci' | 'local';
    SENTRY_DSN: string;

    MONGO_URL: string;
    RABBITMQ_CONN_URL: string;

    S3_LOCAL_STACK: string;
    S3_REGION: string;
    S3_BUCKET_NAME: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;

    WEB_BASE_URL: string;
    WIDGET_BASE_URL: string;

    COOKIE_DOMAIN: string;
    GITHUB_OAUTH_REDIRECT: string;
    GITHUB_OAUTH_CLIENT_ID: string;
    GITHUB_OAUTH_CLIENT_SECRET: string;

    SES_REGION: string;
    SES_ACCESS_KEY_ID: string;
    SES_SECRET_ACCESS_KEY: string;
    EMAIL_FROM: string;
    EMAIL_FROM_NAME: string;

    LEAD_REFRESH_TOKEN: string;
    LEAD_CLIENT_ID: string;
    LEAD_CLIENT_SECRET: string;
    LEAD_TOPIC_ID: string;
    LEAD_LIST_KEY: string;
  }
}
