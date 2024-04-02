import './config/env-config';
import { validateEnv } from './config/env-validator';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/esm/AmqpConnectionManager';

import { QueuesEnum } from '@impler/shared';
import { DalService } from '@impler/dal';
import { SendWebhookDataConsumer, EndImportConsumer, SendBubbleDataConsumer } from './consumers';

let connection: IAmqpConnectionManager, chanelWrapper: ChannelWrapper;

validateEnv();

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
      channel.assertQueue(QueuesEnum.SEND_BUBBLE_DATA, {
        durable: false,
      }),
      channel.consume(QueuesEnum.SEND_BUBBLE_DATA, sendBubbleDataConsumer.message.bind(sendBubbleDataConsumer), {
        noAck: true,
      }),
    ]);
  });
}

export function publishToQueue(queueName: QueuesEnum, data: any) {
  chanelWrapper.sendToQueue(queueName, data);
}
