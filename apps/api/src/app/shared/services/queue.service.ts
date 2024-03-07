import { Injectable, Logger } from '@nestjs/common';
import amqp from 'amqp-connection-manager';
import { EndImportData, ProcessFileData, PublishToQueueData, QueuesEnum } from '@impler/shared';

@Injectable()
export class QueueService {
  public isQueueConnected = false;
  private connection: any;
  private chanelWrapper: any;

  constructor() {
    this.connection = amqp.connect([process.env.RABBITMQ_CONN_URL]);
    this.connection.on('connect', () => {
      Logger.log('QueueService RabbitMQ::Connected!');
      this.isQueueConnected = true;
    });
    this.connection.on('error', (error: any) => {
      Logger.error('QueueService RabbitMQ::Error!', error);
    });
    this.connection.on('disconnect', () => {
      Logger.log('QueueService RabbitMQ::Disconnected!');
      this.isQueueConnected = false;
    });

    this.chanelWrapper = this.connection.createChannel({
      json: true,
      persistent: true,
    });
  }

  publishToQueue(queueName: QueuesEnum.END_IMPORT, data: EndImportData): void;
  publishToQueue(queueName: QueuesEnum.PROCESS_FILE, data: ProcessFileData): void;
  async publishToQueue(queueName: QueuesEnum, data: PublishToQueueData) {
    if (this.connection.isConnected()) {
      await this.chanelWrapper.sendToQueue(queueName, data, { durable: false });
    } else {
      throw new Error('RabbitMQ connection is not established');
    }
  }
}
