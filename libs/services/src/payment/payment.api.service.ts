import axios from 'axios';
import { ISubscriptionData, BILLABLEMETRIC_CODE_ENUM, constructQueryString, handleApiError } from '@impler/shared';

interface ICheckData {
  units: number;
  billableMetricCode: BILLABLEMETRIC_CODE_ENUM;
}

interface ICreateUser {
  name: string;
  email: string;
  externalId: string;
}

interface ICustomer {
  name: string;
  email: string;
  externalId: string;
  id: string;
  currency?: 'USD' | 'INR';
}
interface ICheckEvent {
  email: string;
  // eslint-disable-next-line prettier/prettier
  billableMetricCode?: BILLABLEMETRIC_CODE_ENUM;
}

export class PaymentAPIService {
  private AUTH_KEY: string;
  private AUTH_VALUE: string;
  private PAYMENT_API_BASE_URL: string;

  constructor() {
    this.AUTH_KEY = process.env.PAYMENT_API_AUTH_KEY;
    this.AUTH_VALUE = process.env.PAYMENT_API_AUTH_VALUE;
    this.PAYMENT_API_BASE_URL = process.env.PAYMENT_API_BASE_URL;
  }

  async createEvent(createEventData: ICheckData, userExternalIdOrEmail: string) {
    if (!this.PAYMENT_API_BASE_URL) return;

    const createEventAPIBody = {
      customerId: userExternalIdOrEmail,
      billableMetricCode: createEventData.billableMetricCode ?? BILLABLEMETRIC_CODE_ENUM.ROWS,
      timestamp: new Date(),
      metadata: {
        units: createEventData.units,
      },
    };

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/events`;
    try {
      const response = await axios.post(url, createEventAPIBody, {
        headers: {
          [this.AUTH_KEY]: this.AUTH_VALUE,
        },
      });

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError({
        axiosInstance: axios,
        error,
        context: 'createEvent',
        shouldLog: process.env.NODE_ENV === 'development',
      });
      throw new Error(errorMessage);
    }
  }

  async checkEvent({ email, billableMetricCode = BILLABLEMETRIC_CODE_ENUM.ROWS }: ICheckEvent): Promise<boolean> {
    if (!this.PAYMENT_API_BASE_URL) return true;

    let url = `${this.PAYMENT_API_BASE_URL}/api/v1/check`;
    url += constructQueryString({ externalId: email, billableMetricCode });
    const response = await axios.get(url, {
      headers: {
        [this.AUTH_KEY]: this.AUTH_VALUE,
      },
    });

    return response.data.available;
  }

  async createUser(createUser: ICreateUser): Promise<ICustomer | undefined> {
    if (!this.PAYMENT_API_BASE_URL) return undefined;

    const createUserAPIBodyData = {
      name: createUser.name,
      email: createUser.email,
      externalId: createUser.externalId,
      planCode: 'TRIAL',
    };

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/customer`;
    const response = await axios.post(url, createUserAPIBodyData, {
      headers: {
        [this.AUTH_KEY]: this.AUTH_VALUE,
      },
    });

    return response.data;
  }

  async fetchActiveSubscription(email: string): Promise<ISubscriptionData> {
    if (!this.PAYMENT_API_BASE_URL) return;

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/subscription/${email}`;
    const response = await axios.get(url, {
      headers: {
        [this.AUTH_KEY]: this.AUTH_VALUE,
      },
    });

    return response.data;
  }
}
