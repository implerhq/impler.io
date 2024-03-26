/* eslint-disable @typescript-eslint/ban-ts-comment */
import '../../config';

import { NestFactory } from '@nestjs/core';
import { TemplateRepository, WebhookDestinationRepository } from '@impler/dal';
import { SharedModule } from '@shared/shared.module';
import { DestinationsEnum } from '@impler/shared';

export async function run() {
  // eslint-disable-next-line no-console
  console.log('start migration - revising destination fields');

  // Init the mongodb connection
  const app = await NestFactory.create(SharedModule, {
    logger: false,
  });

  const webhookDestinations = [];
  const templateIdsWithDestinations: string[] = [];
  const templateIdsWithoutDestinations: string[] = [];
  const templateRepository = new TemplateRepository();
  const webhookDestinationRepository = new WebhookDestinationRepository();
  const templates = await templateRepository.find({}, 'callbackUrl authHeaderName chunkSize');
  for (const template of templates) {
    // @ts-ignore
    if (template.callbackUrl) {
      webhookDestinations.push({
        _templateId: template._id,
        // @ts-ignore
        callbackUrl: template.callbackUrl,
        // @ts-ignore
        authHeaderName: template.authHeaderName,
        // @ts-ignore
        chunkSize: template.chunkSize,
      });
      templateIdsWithDestinations.push(template._id);
    } else {
      templateIdsWithoutDestinations.push(template._id);
    }
  }

  await webhookDestinationRepository.createMany(webhookDestinations);
  await templateRepository.update(
    {
      _id: {
        $in: templateIdsWithDestinations,
      },
    },
    { $set: { destination: DestinationsEnum.WEBHOOK }, $unset: { callbackUrl: 1, authHeaderName: 1, chunkSize: 1 } }
  );
  await templateRepository.update(
    {
      _id: {
        $in: templateIdsWithoutDestinations,
      },
    },
    { $set: { destination: undefined }, $unset: { callbackUrl: 1, authHeaderName: 1, chunkSize: 1 } }
  );

  console.log('end migration - revising destination fields');

  app.close();
  process.exit(0);
}
run();
