import { port, str, url, ValidatorSpec, bool } from 'envalid';
import * as envalid from 'envalid';
import { ENVTypesEnum } from '@impler/shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validators: { [K in keyof any]: ValidatorSpec<any[K]> } = {
  JWT_SECRET: str(),
  NODE_ENV: str({
    choices: [ENVTypesEnum.LOCAL, ENVTypesEnum.TEST, ENVTypesEnum.PROD, ENVTypesEnum.CI, ENVTypesEnum.LOCAL],
    default: ENVTypesEnum.LOCAL,
  }),
  DISABLE_USER_REGISTRATION: bool({
    default: false,
    desc: 'Flag to disable user registration',
  }),
  S3_LOCAL_STACK: str(),
  S3_BUCKET_NAME: str(),
  S3_REGION: str(),
  PORT: port(),
  MONGO_URL: str(),
  RABBITMQ_CONN_URL: str(),
  AWS_ACCESS_KEY_ID: str({ default: '' }),
  AWS_SECRET_ACCESS_KEY: str({ default: '' }),
  // urls
  WIDGET_BASE_URL: url(),
  WEB_BASE_URL: url(),
  // auth
  COOKIE_DOMAIN: str(),
  GITHUB_OAUTH_CLIENT_ID: str(),
  GITHUB_OAUTH_CLIENT_SECRET: str(),
  GITHUB_OAUTH_REDIRECT: str(),
};

export function validateEnv() {
  envalid.cleanEnv(process.env, validators);
}
