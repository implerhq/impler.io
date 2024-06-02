import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface ILeadInformation {
  'First Name': string;
  'Last Name': string;
  'Lead Email': string;
}

@Injectable()
export class LeadService {
  private log = false;
  private accessTokenDate: Date;
  private accessToken: string;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.accessTokenDate && new Date().getTime() - this.accessTokenDate.getTime() < 3500000) {
      if (this.log) console.log('Using cached access token');

      // 3500000 = 58 minutes
      return this.accessToken;
    }
    if (process.env.LEAD_REFRESH_TOKEN && process.env.LEAD_CLIENT_ID && process.env.LEAD_CLIENT_SECRET) {
      // eslint-disable-next-line max-len
      const url = `https://accounts.zoho.com/oauth/v2/token?client_id=${process.env.LEAD_CLIENT_ID}&grant_type=refresh_token&client_secret=${process.env.LEAD_CLIENT_SECRET}&refresh_token=${process.env.LEAD_REFRESH_TOKEN}`;

      const response = await axios.post(url);
      this.accessTokenDate = new Date();
      this.accessToken = response.data.access_token;
      if (this.log) console.log('New access token generated', this.accessToken);

      return response.data.access_token;
    }
  }

  public async createLead(data: ILeadInformation): Promise<any> {
    const accessToken = await this.getAccessToken();
    if (accessToken) {
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
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        }
      );
      if (this.log) console.log('Lead created', maResponse.data);

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
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        }
      );
      if (this.log) console.log('Lead created', crmResponse.data);

      return crmResponse.data;
    }
  }
}
