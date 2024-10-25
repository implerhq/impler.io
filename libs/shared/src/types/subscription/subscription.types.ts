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
  };
  expiryDate: string;
  meta: {
    IMPORTED_ROWS: {
      flat_fee: number;
      per_unit: number;
      last_unit: string | number;
      first_unit: number;
    }[];
    IMAGE_UPLOAD: boolean;
    REMOVE_BRANDING: boolean;
    AUTOMATIC_IMPORTS: boolean;
    ADVANCED_VALIDATORS: boolean;
  };
  customer?: {
    paymentMethodCurrency?: string;
    paymentMethodId?: string;
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
