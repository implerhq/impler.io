import './config/env-config';
import amqp from 'amqp-connection-manager';
import { ProcessFileConsumer } from './consumers';
import { QueuesEnum } from '@impler/shared';
import { DalService } from '@impler/dal';

export async function bootstrap() {
  // conenct dal service
  const dalService = new DalService();
  await dalService.connect(process.env.MONGO_URL);

  // connect to amqp rabbitmq server
  const connection = amqp.connect([process.env.RABBITMQ_CONN_URL]);
  connection.on('connect', () => console.log('QueueManager RabbitMQ::Connected!'));
  connection.on('disconnect', (err: Error) => console.log('RabbitMQ::Disconnected.', err));

  // create channel
  const chanelWrapper = connection.createChannel({
    json: true,
  });

  // initialize consumers
  const processFileConsumer = new ProcessFileConsumer();

  // add queues to channel
  chanelWrapper.addSetup((channel) => {
    return Promise.all([
      channel.assertQueue(QueuesEnum.PROCESS_FILE, {
        durable: false,
      }),
      channel.consume(QueuesEnum.PROCESS_FILE, processFileConsumer.message.bind(processFileConsumer), { noAck: true }),
    ]);
  });
}
