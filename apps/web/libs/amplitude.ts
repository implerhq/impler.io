import { setUserId, track as AmplitudeTrack } from '@amplitude/analytics-browser';

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
      name: 'SIGNUP';
      properties: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
      };
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
      properties: Record<string, never>;
    }
  | {
      name: 'OUTPUT FORMAT UPDATED';
      properties: Record<string, never>;
    }
  | {
      name: 'PROJECT CREATE';
      properties: {
        duringOnboard: boolean;
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
        firstName?: string;
        lastName?: string;
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
        hasAuthHeaderName?: boolean;
        hasCallbackUrl?: boolean;
      };
    }
  | {
      name: 'LOGOUT';
      properties: Record<string, never>;
    };

export function track({ name, properties }: TrackData) {
  AmplitudeTrack(name, properties);
  if (name === 'GITHUB CONTINUE') {
    setUserId(properties.id);
  }
}
