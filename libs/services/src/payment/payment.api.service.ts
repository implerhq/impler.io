import axios from 'axios';
import { ISubscriptionData, AVAILABLE_BILLABLEMETRIC_CODE_ENUM, constructQueryString } from '@impler/shared';

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
  currency?: 'USD' | 'INR';
}
interface ICheckEvent {
  email: string;
  // eslint-disable-next-line prettier/prettier
  billableMetricCode?: AVAILABLE_BILLABLEMETRIC_CODE_ENUM;
}

// eslint-disable-next-line @typescript-eslint/naming-convention

export class PaymentAPIService {
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
      billableMetricCode: AVAILABLE_BILLABLEMETRIC_CODE_ENUM.IMPORTED_ROWS,
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

  async checkEvent({
    email,
    billableMetricCode = AVAILABLE_BILLABLEMETRIC_CODE_ENUM.IMPORTED_ROWS,
  }: ICheckEvent): Promise<boolean> {
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
    };

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/customer`;
    const response = await axios.post(url, createUserAPIBodyData, {
      headers: {
        [this.AUTH_KEY]: this.AUTH_VALUE,
      },
    });

    return response.data;
  }

  async getCustomer(externalId: string): Promise<ICustomer> {
    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/customer/${externalId}`;
    const response = await axios.get(url, {
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

  async subscribe({
    planCode,
    email,
    selectedPaymentMethod,
    couponCode,
  }: {
    planCode: string;
    email: string;
    selectedPaymentMethod: string;
    couponCode?: string;
  }) {
    if (!this.PAYMENT_API_BASE_URL) return;

    let url = `${this.PAYMENT_API_BASE_URL}/api/v1/plans/${planCode}/buy/${email}?paymentMethodId=${selectedPaymentMethod}`;
    if (couponCode) {
      url += `&couponCode=${couponCode}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          [this.AUTH_KEY]: this.AUTH_VALUE,
        },
      });

      return response.data;
    } catch (error) {
      const isAxios = axios.isAxiosError(error);
      const errorDetails = isAxios
        ? {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
          }
        : { message: error.message, stack: error.stack };

      console.error('Error details:', errorDetails);

      throw error;
    }
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

  async updatePaymentMethod(email: string, paymentMethodId: string): Promise<any> {
    if (!this.PAYMENT_API_BASE_URL) return;

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/customer/${email}/payment-id/${paymentMethodId}`;
    const response = await axios.put(
      url,
      {},
      {
        headers: {
          [this.AUTH_KEY]: this.AUTH_VALUE,
        },
      }
    );

    return response.data;
  }

  async confirmPaymentIntentId(email: string, intentId: string): Promise<any> {
    if (!this.PAYMENT_API_BASE_URL) return;

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/customer/${email}/payment-intent-id-confirm/${intentId}`;
    const response = await axios.put(
      url,
      {},
      {
        headers: {
          [this.AUTH_KEY]: this.AUTH_VALUE,
        },
      }
    );

    return response.data;
  }

  async retriveUserPaymentMethods(email: string): Promise<any> {
    if (!this.PAYMENT_API_BASE_URL) return;

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/customer/${email}/payment-methods`;
    const response = await axios.get(url, {
      headers: {
        [this.AUTH_KEY]: this.AUTH_VALUE,
      },
    });

    return response.data;
  }
  async deleteUserPaymentMethod(paymentMethodId: string): Promise<any> {
    if (!this.PAYMENT_API_BASE_URL) return;

    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/customer/${paymentMethodId}/payment-methods`;
    const response = await axios.delete(url, {
      headers: {
        [this.AUTH_KEY]: this.AUTH_VALUE,
      },
    });

    return response.data;
  }

  async getTransactionHistory(email: string) {
    if (!this.PAYMENT_API_BASE_URL) return;
    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/transaction/${email}/history`;
    const response = await axios.get(url, {
      headers: {
        [this.AUTH_KEY]: this.AUTH_VALUE,
      },
    });

    return response.data;
  }

  async checkAppliedCoupon(couponCode: string, userEmail: string, planCode: string) {
    const url = `${this.PAYMENT_API_BASE_URL}/api/v1/coupon/${couponCode}/apply/${userEmail}/plan/${planCode}`;
    try {
      const response = await axios.get(url, {
        headers: {
          [this.AUTH_KEY]: this.AUTH_VALUE,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error();
    }
  }
  async checkout({
    externalId,
    paymentMethodId,
    planCode,
    couponCode,
  }: {
    externalId: string;
    planCode: string;
    paymentMethodId: string;
    couponCode?: string;
  }) {
    try {
      let url = `${this.PAYMENT_API_BASE_URL}/api/v1/checkout`;
      url += constructQueryString({ planCode, externalId, paymentMethodId, couponCode });

      const response = await axios.get(url, {
        headers: {
          [this.AUTH_KEY]: this.AUTH_VALUE,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw new Error('Failed to perform checkout operation.');
    }
  }
}
