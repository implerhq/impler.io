import { port, str, url, ValidatorSpec } from 'envalid';
import * as envalid from 'envalid';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validators: { [K in keyof any]: ValidatorSpec<any[K]> } = {
  NODE_ENV: str({
    choices: ['dev', 'test', 'prod', 'ci', 'local'],
    default: 'local',
  }),
  S3_LOCAL_STACK: str({
    default: '',
  }),
  S3_BUCKET_NAME: str(),
  S3_REGION: str(),
  PORT: port(),
  FRONT_BASE_URL: url(),
  MONGO_URL: str(),
  RABBITMQ_CONN_URL: str(),
  SENTRY_DSN: str(),
};

export function validateEnv() {
  envalid.cleanEnv(process.env, validators);
}
