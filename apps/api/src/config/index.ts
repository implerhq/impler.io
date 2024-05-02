import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const envFileMapper = {
  prod: '.env.production',
  test: '.env.test',
  ci: '.env.ci',
  local: '.env',
  dev: '.env.development',
};
const selectedEnvFile = envFileMapper[process.env.NODE_ENV] || '.env';

let pathToDotEnv = `${__dirname}/${process.env.E2E_RUNNER ? '..' : 'src'}/${selectedEnvFile}`;

if (process.env.MIGRATION) {
  pathToDotEnv = path.join(__dirname, `../${selectedEnvFile}`);
}

const { error } = dotenv.config({ path: pathToDotEnv });
if (error && !process.env.LAMBDA_TASK_ROOT) throw error;
