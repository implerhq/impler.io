import '../../config';
import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';
import { UserRolesEnum } from '@impler/shared';
import { EnvironmentRepository, Environment } from '@impler/dal';

export async function run() {
  console.log('Start migration - moving key to root and adding role to apiKeys');

  // Initialize the MongoDB connection
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const environmentRepository = new EnvironmentRepository();

  const environments = await environmentRepository.find({});

  const batchOperations = [];
  for (const environment of environments) {
    if (environment.apiKeys && environment.apiKeys.length > 0) {
      const firstApiKey = environment.apiKeys[0];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const key = firstApiKey.key;

      const updatedApiKeys = environment.apiKeys.map((apiKey) => ({
        ...apiKey,
        role: UserRolesEnum.ADMIN,
        isOwner: true,
      }));

      if (key === null || key === undefined) {
        console.error(`Skipping environment ${environment._id} due to null key`);
        continue;
      }

      batchOperations.push({
        updateOne: {
          filter: { _id: environment._id },
          update: {
            $set: {
              key: key,
              apiKeys: updatedApiKeys,
            },
          },
        },
      });
    }
  }

  if (batchOperations.length > 0) {
    await Environment.bulkWrite(batchOperations, {
      ordered: false,
    });
    batchOperations.length = 0;
  }

  console.log('End migration - key moved to root and role added to apiKeys');

  app.close();
  process.exit(0);
}
run();
