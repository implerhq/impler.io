import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface ILeadInformation {
  'First Name': string;
  'Last Name': string;
  'Lead Email': string;
}

@Injectable()
export class LeadService {
  private log = process.env.NODE_ENV === 'local';
  private maAccessTokenDate: Date;
  private maAccessToken: string;
  private crmAccessTokenDate: Date;
  private crmAccessToken: string;

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
  }
  private async getCRMAccessToken(): Promise<string> {
    if (
      this.crmAccessToken &&
      this.crmAccessTokenDate &&
      new Date().getTime() - this.crmAccessTokenDate.getTime() < 3500000
    ) {
      if (this.log) console.log('Using cached crm access token');

      // 3500000 = 58 minutes
      return this.maAccessToken;
    }
    if (
      process.env.CRM_REFRESH_TOKEN &&
      process.env.CRM_CLIENT_ID &&
      process.env.CRM_CLIENT_SECRET &&
      process.env.DO_TEST
    ) {
      // eslint-disable-next-line max-len
      const url = `https://accounts.zoho.com/oauth/v2/token?client_id=${process.env.CRM_CLIENT_ID}&grant_type=refresh_token&client_secret=${process.env.CRM_CLIENT_SECRET}&refresh_token=${process.env.CRM_REFRESH_TOKEN}`;
      if (this.log) console.log('CRM URL', url);

      const response = await axios.post(url);
      this.crmAccessTokenDate = new Date();
      this.crmAccessToken = response.data.access_token;
      if (this.log) console.log('New crm token generated', this.crmAccessToken);

      return response.data.access_token;
    }
  }

  public async createLead(data: ILeadInformation): Promise<any> {
    const maAccessToken = await this.getMaAccessToken();
    if (maAccessToken) {
      // Add Lead to marketing automation
      const maUrl = `https://marketingautomation.zoho.com/api/v1/json/listsubscribe?listkey=${
        process.env.LEAD_LIST_KEY
      }&leadinfo=${JSON.stringify(data)}&topic_id=${process.env.LEAD_TOPIC_ID}`;
      if (this.log) console.log(maUrl);

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
    }
    const crmAccessToken = await this.getCRMAccessToken();
    if (crmAccessToken) {
      // Add Lead to Zoho CRM
      const crmUrl = `https://www.zohoapis.com/crm/v6/Leads`;
      if (this.log) console.log(crmUrl);

      const crmResponse = await axios.post(
        crmUrl,
        {
          data: [
            {
              Last_Name: data['Last Name'],
              First_Name: data['First Name'],
              Email: data['Lead Email'],
            },
          ],
        },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${crmAccessToken}`,
          },
        }
      );
      if (this.log) console.log('CRM LEad created', crmResponse.data);
    }
  }
}
