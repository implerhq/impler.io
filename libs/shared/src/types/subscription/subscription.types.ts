export interface ISubscriptionData {
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
  expiryDate: string;
  meta: {
    IMPORTED_ROWS: number;
    REMOVE_BRANDING: boolean;
    AUTOMATIC_IMPORTS: boolean;
    ADVANCED_VALIDATORS: boolean;
    TEAM_MEMBERS: number;
  };
}

export interface ICardData {
  paymentMethodId: string;
  brand: string;
  last4Digits: string;
  expMonth: number;
  expYear: number;
}
