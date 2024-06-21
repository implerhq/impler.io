import '../../config';
import { AppModule } from '../../app.module';

import { NestFactory } from '@nestjs/core';
import { PaymentAPIService } from '@impler/shared';
import { UserRepository } from '@impler/dal';

export async function run() {
  // eslint-disable-next-line no-console
  console.log('start migration - registering payment users');

  // Init the mongodb connection
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const userRepository = new UserRepository();
  const paymentAPIService = new PaymentAPIService();
  const users = await userRepository.find({}, 'email firstName lastName');

  if (users.length > 0) {
    // eslint-disable-next-line no-console
    for (const user of users) {
      await paymentAPIService.createUser({
        email: user.email,
        externalId: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });
    }
  }

  // eslint-disable-next-line no-console
  console.log('end migration - registering payment users');

  app.close();
  process.exit(0);
}
run();
