import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface ISaveResults {
  uploadId: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  email?: string;
}

interface ICreateUser {
  name: string;
  email: string;
  externalId: string;
}

interface ICustomerEmail {
  externaId: string;
}

@Injectable()
export class PaymentAPIService {
  private PAYMENT_API_BASE_URL: string = process.env.PAYMENT_GATEWAY_URL;
  private authKey = process.env.PAYMENT_API_AUTH_KEY;
  private authValue = process.env.PAYMENT_API_AUTH_VALUE;

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
        [this.authKey]: this.authValue,
      },
    });
  }

  async checkEvent(resultData?: ISaveResults) {
    if (!this.PAYMENT_API_BASE_URL) return;
    const queryParams = {
      externalId: resultData.email,
      billableMetricCode: 'IMPORTED_ROWS',
    };

    const url = `${this.PAYMENT_API_BASE_URL}/check?externalId=${queryParams.externalId}&billableMetricCode=${queryParams.billableMetricCode}`;
    try {
      const response = await axios.get(url, {
        headers: {
          [this.authKey]: this.authValue,
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
        [this.authKey]: this.authValue,
      },
    });

    return response.data;
  }

  async fetchMembership(externalId: ICustomerEmail) {
    const url = `${this.PAYMENT_API_BASE_URL}/subscription/${externalId}`;
    const response = await axios.get(url, {
      headers: {
        [this.authKey]: this.authValue,
      },
    });

    console.log('fetch membership from the api', response.data);
  }
}
