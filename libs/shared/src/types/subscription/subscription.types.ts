export interface ISubscriptionData {
  plan: {
    code: string;
    name: string;
    fixedCost: number;
    interval: string;
    charges: {
      billableMetric: {
        code: string;
        name: string;
      };
      chargeModal: 'FIXED' | 'VOLUME_BASED' | 'BINARY';
      properties: Record<string, string | number>;
    }[];
    charge: number;
    canceledOn?: string;
  };
  isActive: boolean;
  usage: {
    IMPORTED_ROWS: number;
    ROWS: number;
    TEAM_MEMBERS: number;
  };
  expiryDate: string;
  meta: {
    IMPORTED_ROWS: {
      flat_fee: number;
      per_unit: number;
      last_unit: string | number;
      first_unit: number;
    }[];
    REMOVE_BRANDING?: boolean;
    AUTOMATIC_IMPORTS?: boolean;
    ADVANCED_VALIDATORS?: boolean;
    FREEZE_COLUMNS?: boolean;
    TEAM_MEMBERS?: number;
    ROWS?: number;
    MANUAL_ENTRY?: boolean;
    DOWNLOAD_SAMPLE_FILE?: boolean;
    MAX_RECORDS?: boolean;
    REQUIRED_VALUES?: boolean;
    DEFAULT_VALUES?: boolean;
    RUNTIME_SCHEMA?: boolean;
    DATA_SEEDING?: boolean;
  };
  customer?: {
    paymentMethodCurrency?: string;
    paymentMethodId?: string;
    externalId?: string;
  };
  tax?: number;
  amount?: number;
}

export interface ICardData {
  paymentMethodId: string;
  brand: string;
  last4Digits: string;
  expMonth: number;
  expYear: number;
}
