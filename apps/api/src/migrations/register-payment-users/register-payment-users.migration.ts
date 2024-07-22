import '../../config';
import { AppModule } from '../../app.module';

import { NestFactory } from '@nestjs/core';
import { UserRepository } from '@impler/dal';
import { PaymentAPIService } from '@impler/services';

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
    await Promise.all(
      users.map(async (user) => {
        try {
          await paymentAPIService.createUser({
            email: user.email,
            externalId: user.email,
            name: `${user.firstName} ${user.lastName}`,
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(error);
        }
      })
    );
  }

  // eslint-disable-next-line no-console
  console.log('end migration - registering payment users');

  app.close();
  process.exit(0);
}
run();
