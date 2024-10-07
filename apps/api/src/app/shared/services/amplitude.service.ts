import { Injectable } from '@nestjs/common';
import { init, track } from '@amplitude/analytics-node';

@Injectable()
export class AmplitudeService {
  constructor() {
    if (process.env.AMPLITUDE_ID) {
      init(process.env.AMPLITUDE_ID);
    }
  }
  recordsImported(email: string, data: { records: number; valid: number; invalid: number }) {
    if (process.env.AMPLITUDE_ID) {
      track('RECORDS IMPORTED', data, {
        user_id: email,
      });
    }
  }
}
