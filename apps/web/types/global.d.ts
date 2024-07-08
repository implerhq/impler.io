/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-unused-vars */
declare module '@tawk.to/tawk-messenger-react';

namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_EMBED_URL: string;
    NEXT_PUBLIC_AMPLITUDE_ID: string;
    NEXT_PUBLIC_TAWK_PROPERTY_ID: string;
    NEXT_PUBLIC_TAWK_WIDGET_ID: string;
    NEXT_PUBLIC_OPENREPLAY_KEY: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID: string;

    NEXT_PUBLIC_PAYMENT_GATEWAY_URL: string;
    NEXT_PUBLIC_GTM_ID: string;
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  }
}

interface IProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  _projectId: string;
  accessToken: string;
}

interface ChargeItem {
  first_unit: number;
  last_unit: number;
  per_unit: number;
}

interface ISubscriptionData {
  plan: {
    code: string;
    name: string;
    charges: {
      billableMetric: {
        code: string;
        name: string;
      };
      chargeModal: 'FIXED' | 'VOLUME_BASED';
      properties: Record<string, string | number>;
    }[];
    charge: number;
    canceledOn?: Date;
  };
  isActive: boolean;
  usage: {
    IMPORTED_ROWS: number;
  };
  expiryDate: Date;
  meta: {
    IMPORTED_ROWS: number;
  };
}

interface ICreateProjectData {
  name: string;
}

interface ICreateTemplateData {
  name: string;
}
interface IDuplicateTemplateData {
  name: string;
  _projectId: string;
  duplicateColumns?: boolean;
  duplicateDestination?: boolean;
  duplicateWebhook?: boolean;
  duplicateValidator?: boolean;
}
interface IUpdateTemplateData {
  mode?: string;
  name?: string;
}

interface Window {
  impler: any;
}

interface ISigninData {
  email: string;
  password: string;
}

interface ISignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface IImportCountData {
  date: string;
  records: {
    Completed: number;
    Terminated: number;
    Mapping: number;
    Reviewing: number;
  };
}

interface ITransactionHistory {
  _id: string;
  transactionDate: Date;
  planName: string;
  transactionStatus: string;
  membershipDate: Date;
  expiryDate: string;
  isPlanActive: boolean;
  charge: number;
  amount: number;
  currency: string;
}

interface ICheckoutData {
  planName: string;
  planAmount: number;
  outstandingAmount?: number;
  currency: string;
  totalPrice: number;
  discount?: number;
  proratedRefund?: number;
}
