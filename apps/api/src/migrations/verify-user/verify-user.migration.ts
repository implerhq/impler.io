import '../../config';
import { AppModule } from '../../app.module';

import { NestFactory } from '@nestjs/core';
import { UserRepository } from '@impler/dal';

export async function run() {
  // eslint-disable-next-line no-console
  console.log('start migration - verify users');

  // Init the mongodb connection
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const userRepository = new UserRepository();
  await userRepository.update({}, { isEmailVerified: true });

  // eslint-disable-next-line no-console
  console.log('end migration - verify users');

  app.close();
  process.exit(0);
}
run();
