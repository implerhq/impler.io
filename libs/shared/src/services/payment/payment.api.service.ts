import axios from 'axios';

interface ICheckData {
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

interface ICustomer {
  name: string;
  email: string;
  externalId: string;
  id: string;
  currency: 'USD' | 'INR';
}
interface ISubscriptionData {
  usage: {
    IMPORTED_ROWS: number;
  };
  plan: {
    charges: {
      billableMetric: {
        code: string;
        name: string;
      };
      chargeModel: string;
      properties?:
      | {
        available: boolean;
      }
      | {
        per_unit: number;
        last_unit: number | string;
        first_unit: number;
      }[];
    }[];
  };
}

type AVAILABLE_CODES = 'IMPORTED_ROWS' | 'REMOVE_BRANDING';

export class PaymentAPIService {
  private CODE: AVAILABLE_CODES = 'IMPORTED_ROWS';
  private AUTH_KEY: string;
  private AUTH_VALUE: string;
  private PAYMENT_API_BASE_URL: string;

  constructor() {
    this.AUTH_KEY = process.env.PAYMENT_API_AUTH_KEY;
    this.AUTH_VALUE = process.env.PAYMENT_API_AUTH_VALUE;
    this.PAYMENT_API_BASE_URL = process.env.PAYMENT_API_BASE_URL;
  }

  async createEvent(resultData: ICheckData, userExternalIdOrEmail: string) {
    if (!this.PAYMENT_API_BASE_URL) return;

    const createEventAPIBody = {
      customerId: userExternalIdOrEmail,
      billableMetricCode: this.CODE,
      timestamp: new Date(),
      metadata: {
        units: resultData.totalRecords,
      },
    };

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/events`;
    await axios.post(url, createEventAPIBody, {
      headers: {
        [this.AUTH_KEY]: this.AUTH_VALUE,
      },
    });
  }

  async checkEvent(email: string, type: AVAILABLE_CODES = 'IMPORTED_ROWS'): Promise<boolean> {
    if (!this.PAYMENT_API_BASE_URL) return true;

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/check?externalId=${email}&billableMetricCode=${type}`;
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

  async cancelSubscription(email: string): Promise<ISubscriptionData> {
    if (!this.PAYMENT_API_BASE_URL) return;

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/subscription/${email}`;
    const response = await axios.delete(url, {
      headers: {
        [this.AUTH_KEY]: this.AUTH_VALUE,
      },
    });

    return response.data;
  }
}