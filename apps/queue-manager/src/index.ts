import './config/env-config';
import amqp from 'amqp-connection-manager';
import { processFile } from './consumers';
import { QueuesEnum } from '@impler/shared';

const connection = amqp.connect([process.env.RABBITMQ_CONN_URL]);
connection.on('connect', () => console.log('QueueManager RabbitMQ::Connected!'));
connection.on('disconnect', (err: Error) => console.log('RabbitMQ::Disconnected.', err));

const chanelWrapper = connection.createChannel({
  json: true,
});

chanelWrapper.addSetup((channel) => {
  return Promise.all([
    channel.assertQueue(QueuesEnum.PROCESS_FILE, {
      durable: false,
    }),
    channel.consume(QueuesEnum.PROCESS_FILE, processFile, { noAck: true }),
  ]);
});
