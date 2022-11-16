import { Injectable } from '@nestjs/common';
import amqp from 'amqp-connection-manager';
import { ProcessFileData, PublishToQueueData, QueuesEnum } from '@impler/shared';

@Injectable()
export class QueueService {
  private connection: any;
  private chanelWrapper: any;

  constructor() {
    this.connection = amqp.connect([process.env.RABBITMQ_CONN_URL]);
    this.connection.on('connect', () => console.log('QueueService RabbitMQ::Connected!'));
    this.connection.on('disconnect', (err: Error) => console.log('RabbitMQ::Disconnected.', err));

    this.chanelWrapper = this.connection.createChannel({
      json: true,
      persistent: true,
    });
  }

  publishToQueue(queueName: QueuesEnum.PROCESS_FILE, data: ProcessFileData): void;
  publishToQueue(queueName: QueuesEnum, data: PublishToQueueData) {
    if (this.connection.isConnected()) {
      this.chanelWrapper.sendToQueue(queueName, data, { durable: false });
    } else {
      throw new Error('RabbitMQ connection is not established');
    }
  }
}
