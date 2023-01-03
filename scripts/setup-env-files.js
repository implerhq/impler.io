/* eslint-disable no-console */
const fs = require('fs');

(async () => {
  const appsEnvInSrc = ['api', 'queue-manager'];
  const appsEnvInRoot = ['demo', 'widget'];

  console.log('----------------------------------------');
  console.log('Pre-populating .env files from .example.env');

  for (const app of appsEnvInSrc) {
    const exists = fs.existsSync(`${__dirname}/../apps/${app}/src/.env`);

    if (!exists) {
      console.log(`Populating ${app} with .env file`);
      fs.copyFileSync(`${__dirname}/../apps/${app}/src/.example.env`, `${__dirname}/../apps/${app}/src/.env`);
    }
  }

  for (const app of appsEnvInRoot) {
    const exists = fs.existsSync(`${__dirname}/../apps/${app}/.env`);

    if (!exists) {
      console.log(`Populating ${app} with .env file`);
      fs.copyFileSync(`${__dirname}/../apps/${app}/.example.env`, `${__dirname}/../apps/${app}/.env`);
    }
  }

  console.log('Finished populating .env files');
  console.log('----------------------------------------');
})();
