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

const PREFETCH_COUNT = 10;
const DEAD_LETTER_EXCHANGE = 'impler-dlx';

validateEnv();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new Sentry.Integrations.Console({ tracing: true })],
    tracesSampleRate: 1.0,
  });
}

function createSafeConsumer(consumer: { message: (data: any) => void }, channel: any) {
  return async (msg: any) => {
    if (!msg) return;
    try {
      await consumer.message(msg);
      channel.ack(msg);
    } catch (error) {
      console.error(`[Queue] Consumer error:`, error?.message || error);
      if (process.env.SENTRY_DSN) {
        Sentry.captureException(error);
      }
      // Reject and do not requeue - message goes to dead letter queue
      channel.nack(msg, false, false);
    }
  };
}

export async function bootstrap() {
  // connect dal service
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

  const queueOptions = {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': DEAD_LETTER_EXCHANGE,
    },
  };

  // add queues to channel
  chanelWrapper.addSetup((channel) => {
    return Promise.all([
      // Set prefetch to limit concurrent message processing
      channel.prefetch(PREFETCH_COUNT),

      // Setup dead letter exchange
      channel.assertExchange(DEAD_LETTER_EXCHANGE, 'direct', { durable: true }),
      channel.assertQueue('dead-letter-queue', { durable: true }),
      channel.bindQueue('dead-letter-queue', DEAD_LETTER_EXCHANGE, ''),

      // Setup durable queues with manual ack
      channel.assertQueue(QueuesEnum.END_IMPORT, queueOptions),
      channel.consume(
        QueuesEnum.END_IMPORT,
        createSafeConsumer(endImportConsumer, channel),
        { noAck: false }
      ),

      channel.assertQueue(QueuesEnum.SEND_WEBHOOK_DATA, queueOptions),
      channel.consume(
        QueuesEnum.SEND_WEBHOOK_DATA,
        createSafeConsumer(sendWebhookdataConsumer, channel),
        { noAck: false }
      ),

      channel.assertQueue(QueuesEnum.SEND_FAILED_WEBHOOK_DATA, queueOptions),
      channel.consume(
        QueuesEnum.SEND_FAILED_WEBHOOK_DATA,
        createSafeConsumer(sendFailedWebhookDataConsumer, channel),
        { noAck: false }
      ),

      channel.assertQueue(QueuesEnum.SEND_BUBBLE_DATA, queueOptions),
      channel.consume(
        QueuesEnum.SEND_BUBBLE_DATA,
        createSafeConsumer(sendBubbleDataConsumer, channel),
        { noAck: false }
      ),

      channel.assertQueue(QueuesEnum.GET_IMPORT_JOB_DATA, queueOptions),
      channel.consume(
        QueuesEnum.GET_IMPORT_JOB_DATA,
        createSafeConsumer(autoImportJobbDataConsumer, channel),
        { noAck: false }
      ),

      channel.assertQueue(QueuesEnum.SEND_IMPORT_JOB_DATA, queueOptions),
      channel.consume(
        QueuesEnum.SEND_IMPORT_JOB_DATA,
        createSafeConsumer(sendImportJobDataConsumer, channel),
        { noAck: false }
      ),
    ]);
  });
}

export function publishToQueue(queueName: QueuesEnum, data: any) {
  chanelWrapper.sendToQueue(queueName, data, { persistent: true });
}
