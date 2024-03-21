import './config/env-config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { SendWebhookDataConsumer, EndImportConsumer } from './consumers';
import { QueuesEnum } from '@impler/shared';
import { DalService } from '@impler/dal';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/esm/AmqpConnectionManager';
import { validateEnv } from './config/env-validator';

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
  const sendWebhookdataConsumer = new SendWebhookDataConsumer();
  const endImportConsumer = new EndImportConsumer();

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
    ]);
  });
}

export function publishToQueue(queueName: QueuesEnum, data: any) {
  chanelWrapper.sendToQueue(queueName, data);
}
