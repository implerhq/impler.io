import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { LEAD_SIGNUP_USING } from '@shared/constants';
import { captureException } from '@shared/helpers/common.helper';

interface ILeadInformation {
  'First Name': string;
  'Last Name': string;
  'Lead Email': string;
  'Signup Method': LEAD_SIGNUP_USING;
  Role: string;
  'CRM Source': string;
  'Est. Employees': string;
}

@Injectable()
export class LeadService {
  private log = process.env.NODE_ENV === 'local';
  private maAccessTokenDate: Date;
  private maAccessToken: string;

  private async getMaAccessToken(): Promise<string> {
    if (
      this.maAccessToken &&
      this.maAccessTokenDate &&
      new Date().getTime() - this.maAccessTokenDate.getTime() < 3500000
    ) {
      if (this.log) console.log('Using cached ma access token');

      // 3500000 = 58 minutes
      return this.maAccessToken;
    }
    if (process.env.LEAD_REFRESH_TOKEN && process.env.LEAD_CLIENT_ID && process.env.LEAD_CLIENT_SECRET) {
      // eslint-disable-next-line max-len
      const url = `https://accounts.zoho.com/oauth/v2/token?client_id=${process.env.LEAD_CLIENT_ID}&grant_type=refresh_token&client_secret=${process.env.LEAD_CLIENT_SECRET}&refresh_token=${process.env.LEAD_REFRESH_TOKEN}`;
      if (this.log) console.log('Lead URL', url);

      const response = await axios.post(url);
      this.maAccessTokenDate = new Date();
      this.maAccessToken = response.data.access_token;
      if (this.log) console.log('New access token generated', this.maAccessToken);

      return response.data.access_token;
    }

    return undefined;
  }

  public async createLead(data: ILeadInformation): Promise<void> {
    const maAccessToken = await this.getMaAccessToken();
    if (maAccessToken) {
      const leadData = JSON.stringify({
        'First Name': data['First Name'],
        'Last Name': data['Last Name'],
        'Lead Email': data['Lead Email'],
        Role: data.Role,
        'Est. Employees': data['Est. Employees'],
        'CRM Source': data['CRM Source'],
      });
      // Add Lead to marketing automation
      // eslint-disable-next-line max-len
      const maUrl = `https://marketingautomation.zoho.com/api/v1/json/listsubscribe?listkey=${process.env.LEAD_LIST_KEY}&leadinfo=${leadData}&topic_id=${process.env.LEAD_TOPIC_ID}`;
      if (this.log) console.log(maUrl);

      try {
        const maResponse = await axios.post(
          maUrl,
          {},
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${maAccessToken}`,
            },
          }
        );
        if (this.log) console.log('Lead created', maResponse.data);
      } catch (error) {
        captureException(error);
      }
    }
    if (process.env.LEAD_MAKE_WEBHOOK_URL) {
      try {
        await axios.post(process.env.LEAD_MAKE_WEBHOOK_URL, {
          firstName: data['First Name'],
          lastName: data['Last Name'],
          email: data['Lead Email'],
          signupMethod: data['Signup Method'],
          mentionedRole: data.Role,
          leadSource: data['CRM Source'],
          companySize: data['Est. Employees'],
          createdAt: new Date(),
        });
        if (this.log) console.log('Lead data sent to Make.com webhook');
      } catch (error) {
        captureException(error);
        console.error('Error sending data to Make.com webhook:', error);
      }
    }
  }
}
