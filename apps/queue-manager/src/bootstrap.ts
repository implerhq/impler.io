import './config/env-config';
import * as Sentry from '@sentry/node';
import { validateEnv } from './config/env-validator';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/esm/AmqpConnectionManager';

import { QueuesEnum } from '@impler/shared';
import { DalService } from '@impler/dal';
import {
  SendWebhookDataConsumer,
  EndImportConsumer,
  SendBubbleDataConsumer,
  SendAutoImportJobDataConsumer,
  SendImportJobDataConsumer,
  SendFailedWebhookDataConsumer,
} from './consumers';

let connection: IAmqpConnectionManager, chanelWrapper: ChannelWrapper;

validateEnv();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new Sentry.Integrations.Console({ tracing: true })],
    tracesSampleRate: 1.0,
  });
}

export async function bootstrap() {
  // conenct dal service
  const dalService = new DalService();
  await dalService.connect(process.env.MONGO_URL);

  // connect to amqp rabbitmq server
  connection = amqp.connect([process.env.RABBITMQ_CONN_URL]);
  connection.on('connect', () => console.log('QueueManager RabbitMQ::Connected!'));
  connection.on('disconnect', (err: Error) => console.log('RabbitMQ::Disconnected.', err));

  // create channel
  chanelWrapper = connection.createChannel({
    json: true,
  });

  // initialize consumers
  const endImportConsumer = new EndImportConsumer();
  const sendBubbleDataConsumer = new SendBubbleDataConsumer();
  const sendWebhookdataConsumer = new SendWebhookDataConsumer();
  const sendFailedWebhookDataConsumer = new SendFailedWebhookDataConsumer();
  const autoImportJobbDataConsumer = new SendAutoImportJobDataConsumer();
  const sendImportJobDataConsumer = new SendImportJobDataConsumer();

  // add queues to channel
  chanelWrapper.addSetup((channel) => {
    return Promise.all([
      channel.assertQueue(QueuesEnum.END_IMPORT, {
        durable: false,
      }),
      channel.consume(QueuesEnum.END_IMPORT, endImportConsumer.message.bind(endImportConsumer), { noAck: true }),
      channel.assertQueue(QueuesEnum.SEND_WEBHOOK_DATA, {
        durable: false,
      }),
      channel.consume(QueuesEnum.SEND_WEBHOOK_DATA, sendWebhookdataConsumer.message.bind(sendWebhookdataConsumer), {
        noAck: true,
      }),
      channel.assertQueue(QueuesEnum.SEND_FAILED_WEBHOOK_DATA, {
        durable: false,
      }),
      channel.consume(
        QueuesEnum.SEND_FAILED_WEBHOOK_DATA,
        sendFailedWebhookDataConsumer.message.bind(sendFailedWebhookDataConsumer),
        {
          noAck: true,
        }
      ),
      channel.assertQueue(QueuesEnum.SEND_BUBBLE_DATA, {
        durable: false,
      }),
      channel.consume(QueuesEnum.SEND_BUBBLE_DATA, sendBubbleDataConsumer.message.bind(sendBubbleDataConsumer), {
        noAck: true,
      }),
      channel.assertQueue(QueuesEnum.GET_IMPORT_JOB_DATA, {
        durable: false,
      }),
      channel.consume(
        QueuesEnum.GET_IMPORT_JOB_DATA,
        autoImportJobbDataConsumer.message.bind(autoImportJobbDataConsumer),
        {
          noAck: true,
        }
      ),
      channel.assertQueue(QueuesEnum.SEND_IMPORT_JOB_DATA, {
        durable: false,
      }),
      channel.consume(
        QueuesEnum.SEND_IMPORT_JOB_DATA,
        sendImportJobDataConsumer.message.bind(sendImportJobDataConsumer),
        {
          noAck: true,
        }
      ),
    ]);
  });
}

export function publishToQueue(queueName: QueuesEnum, data: any) {
  chanelWrapper.sendToQueue(queueName, data);
}
