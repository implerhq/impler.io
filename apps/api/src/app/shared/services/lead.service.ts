import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { LEAD_SIGNUP_USING } from '@shared/constants';
import { captureException } from '@shared/helpers/common.helper';

interface ILeadInformation {
  'First Name': string;
  'Last Name': string;
  'Lead Email': string;
  'Signup Method': LEAD_SIGNUP_USING;
  'Mentioned Role': string;
  'Lead Source': string;
  'Company Size': string;
}

@Injectable()
export class LeadService {
  private log = process.env.NODE_ENV === 'local';

  public async createLead(data: ILeadInformation): Promise<void> {
    try {
      await axios.post(process.env.LEAD_MAKE_WEBHOOK_URL, {
        firstName: data['First Name'],
        lastName: data['Last Name'],
        email: data['Lead Email'],
        signupMethod: data['Signup Method'],
        mentionedRole: data['Mentioned Role'],
        leadSource: data['Lead Source'],
        companySize: data['Company Size'],
      });
      if (this.log) console.log('Lead data sent to Make.com webhook');
    } catch (error) {
      captureException(error);
      console.error('Error sending data to Make.com webhook:', error);
    }
  }
}
