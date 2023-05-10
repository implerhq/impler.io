import { track as AmplitudeTrack } from '@amplitude/analytics-browser';

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
      name: 'TOGGLE THEME';
      properties: {
        theme: 'light' | 'dark';
      };
    }
  | {
      name: 'WEB IMPORT';
      properties: Record<string, never>;
    };

export function track({ name, properties }: TrackData) {
  AmplitudeTrack(name, properties);
}
