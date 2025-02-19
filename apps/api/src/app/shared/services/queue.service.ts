import { Injectable, Logger } from '@nestjs/common';
import amqp from 'amqp-connection-manager';
import { EndImportData, SendWebhookData, PublishToQueueData, QueuesEnum, SendRSSXMLData } from '@impler/shared';

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
  publishToQueue(queueName: QueuesEnum.SEND_WEBHOOK_DATA, data: SendWebhookData): void;
  publishToQueue(queueName: QueuesEnum.SEND_FAILED_WEBHOOK_DATA, data: string): void;
  publishToQueue(queueName: QueuesEnum.GET_IMPORT_JOB_DATA, data: SendRSSXMLData): void;

  async publishToQueue(queueName: QueuesEnum, data: PublishToQueueData | SendRSSXMLData | string) {
    if (this.connection.isConnected()) {
      await this.chanelWrapper.sendToQueue(queueName, data, { durable: false });
    } else {
      throw new Error('RabbitMQ connection is not established');
    }
  }
}
