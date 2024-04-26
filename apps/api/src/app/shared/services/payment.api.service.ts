import { UploadRepository } from '@impler/dal/dist/repositories/upload';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface ISaveResults {
  uploadId: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
}

interface ICreateUser {
  name: string;
  email: string;
  externalId: string;
}

@Injectable()
export class PaymentAPIService {
  constructor(private uploadRepository: UploadRepository) {}
  private PAYMENT_API_BASE_URL: string = process.env.PAYMENT_GATEWAY_URL;

  async createEvent(resultData: ISaveResults, userExternalIdOrEmail: string) {
    if (!this.PAYMENT_API_BASE_URL) return;
    const createEventAPIBody = {
      customerId: userExternalIdOrEmail,
      billableMetricCode: 'IMPORTED_ROWS',
      timestamp: new Date(),
      metadata: {
        units: resultData.totalRecords,
      },
    };

    const url = `${this.PAYMENT_API_BASE_URL}/events`;
    await axios.post(url, createEventAPIBody, {
      headers: {
        auth: 'auth',
      },
    });
  }

  async checkEvent(resultData?: ISaveResults) {
    if (!this.PAYMENT_API_BASE_URL) return;
    const queryParams = {
      externalId: await this.uploadRepository.getUserEmailFromUploadId(resultData.uploadId),
      billableMetricCode: 'IMPORTED_ROWS',
    };

    const url = `${this.PAYMENT_API_BASE_URL}/check?externalId=${queryParams.externalId}&billableMetricCode=${queryParams.billableMetricCode}`;
    try {
      const response = await axios.get(url, {
        headers: {
          auth: 'auth',
        },
      });

      return response.data.available;
    } catch (error) {
      Logger.log('Error:', error.response.status, error.response.statusText);
    }
  }

  async createUser(createUser: ICreateUser) {
    const createUserAPIBodyData = {
      name: createUser.name,
      email: createUser.email,
      externalId: createUser.externalId,
    };

    const url = `${this.PAYMENT_API_BASE_URL}/customer`;
    const response = await axios.post(url, createUserAPIBodyData, {
      headers: {
        auth: 'auth',
      },
    });

    return response.data;
  }
}
