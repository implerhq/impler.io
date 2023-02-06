import { port, str, url, ValidatorSpec } from 'envalid';
import * as envalid from 'envalid';
import { ENVTypesEnum } from '@impler/shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validators: { [K in keyof any]: ValidatorSpec<any[K]> } = {
  NODE_ENV: str({
    choices: [ENVTypesEnum.LOCAL, ENVTypesEnum.TEST, ENVTypesEnum.PROD, ENVTypesEnum.CI, ENVTypesEnum.LOCAL],
    default: ENVTypesEnum.LOCAL,
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
  FRONT_BASE_URL: url(),
  WEB_BASE_URL: url(),
  // auth
  CLIENT_SUCCESS_AUTH_REDIRECT: str(),
  GITHUB_OAUTH_CLIENT_ID: str(),
  GITHUB_OAUTH_CLIENT_SECRET: str(),
  GITHUB_OAUTH_REDIRECT: str(),
};

export function validateEnv() {
  envalid.cleanEnv(process.env, validators);
}
