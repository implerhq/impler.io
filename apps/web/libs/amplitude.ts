import { setUserId, track as AmplitudeTrack, Identify, identify, reset } from '@amplitude/analytics-browser';

type TrackData =
  | {
      name: 'COLUMN CREATE';
      properties: {
        columnType: string;
        hasExtraColumnKeys: boolean;
        isRequired: boolean;
        isUnique: boolean;
      };
    }
  | {
      name: 'BULK COLUMN UPDATE';
      properties: Record<string, never>;
    }
  | {
      name: 'SIGNUP';
      properties: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profilePicture?: string;
      };
    }
  | {
      name: 'VERIFY';
      properties: {
        valid: boolean;
      };
    }
  | {
      name: 'RESEND VERIFICATION CODE';
      properties: Record<string, never>;
    }
  | {
      name: 'UPDATE EMAIL';
      properties: Record<string, never>;
    }
  | {
      name: 'SIGNIN';
      properties: {
        id: string;
        email: string;
      };
    }
  | {
      name: 'IMPORT CREATE';
      properties: {
        framework: string;
      };
    }
  | {
      name: 'OUTPUT FORMAT UPDATED';
      properties: Record<string, never>;
    }
  | {
      name: 'SIGNUP DUPLICATE EMAIL';
      properties: {
        onVerify?: boolean;
      };
    }
  | {
      name: 'PROJECT CREATE';
      properties: {
        duringOnboard: boolean;
      };
    }
  | {
      name: 'ONBOARD';
      properties: {
        companySize: string;
        role: string;
        source: string;
      };
    }
  | {
      name: 'PROJECT SWITCH';
      properties: Record<string, never>;
    }
  | {
      name: 'TOGGLE THEME';
      properties: {
        theme: 'light' | 'dark';
      };
    }
  | {
      name: 'WEB IMPORT';
      properties: Record<string, never>;
    }
  | {
      name: 'GITHUB CONTINUE';
      properties: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profilePicture?: string;
      };
    }
  | {
      name: 'HISTORY PAGINATION SIZE CHANGES';
      properties: {
        size: number;
      };
    }
  | {
      name: 'REGENERATE TOKEN';
      properties: Record<string, never>;
    }
  | {
      name: 'HISTORY FILTER';
      properties: {
        date?: string;
        text?: string;
        limit?: number;
      };
    }
  | {
      name: 'VIEW SUMMARY';
      properties: Record<string, never>;
    }
  | {
      name: 'DESTINATION UPDATED';
      properties: {
        destination: string;
      };
    }
  | {
      name: 'LOGOUT';
      properties: Record<string, never>;
    }
  | {
      name: 'ERROR';
      properties: {
        message: string;
      };
    }
  | {
      name: 'IMPORTS PAGINATION';
      properties: {
        limit?: number;
        text?: string;
      };
    }
  | {
      name: 'IMPORT DUPLICATE';
      properties: Record<string, never>;
    }
  | {
      name: 'IMPORT CLICK';
      properties: Record<string, never>;
    }
  | {
      name: 'VIEW PLANS';
      properties: Record<string, never>;
    }
  | {
      name: 'PLAN TOGGLE DURATION';
      properties: {
        yearly: boolean;
      };
    }
  | {
      name: 'SAVE VALIDATION';
      properties: {
        isValid: boolean;
      };
    }
  | {
      name: 'INTEGRATE';
      properties: Record<string, never>;
    }
  | {
      name: 'CHANGE INTEGRATION FRAMEWORK';
      properties: {
        framework: string;
      };
    }
  | {
      name: 'CHANGE INTEGRATION STEPS';
      properties: {
        step: string;
      };
    };

export function track({ name, properties }: TrackData) {
  AmplitudeTrack(name, properties);
  if (name === 'GITHUB CONTINUE' || name === 'SIGNUP') {
    const userIdentity = new Identify();
    userIdentity.set('id', properties.id);
    userIdentity.set('email', properties.email);
    userIdentity.set('firstName', properties.firstName);
    userIdentity.set('lastName', properties.lastName);
    if (properties.profilePicture) {
      userIdentity.set('profilePicture', properties.profilePicture);
    }
    identify(userIdentity);
    setUserId(properties.email);
  } else if (name === 'SIGNIN') {
    const userIdentity = new Identify();
    userIdentity.set('id', properties.id);
    userIdentity.set('email', properties.email);
    identify(userIdentity);
    setUserId(properties.email);
  } else if (name === 'LOGOUT') {
    reset();
  }
}
