import { str, ValidatorSpec } from 'envalid';
import * as envalid from 'envalid';
import { ENVTypesEnum, StorageTypeEnum } from '@impler/shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validators: { [K in keyof any]: ValidatorSpec<any[K]> } = {
  NODE_ENV: str({
    choices: [ENVTypesEnum.DEV, ENVTypesEnum.TEST, ENVTypesEnum.PROD, ENVTypesEnum.CI, ENVTypesEnum.LOCAL],
    default: ENVTypesEnum.LOCAL,
  }),
  STORAGE_TYPE: str({
    choices: [StorageTypeEnum.S3, StorageTypeEnum.AZURE],
    default: StorageTypeEnum.S3,
  }),
  MONGO_URL: str(),
  RABBITMQ_CONN_URL: str(),
  S3_LOCAL_STACK: str({
    default: '',
  }),
  S3_BUCKET_NAME: str(),
  S3_REGION: str(),
};

export function validateEnv() {
  envalid.cleanEnv(process.env, validators);
}
