import axios, { AxiosError } from 'axios';
import { Injectable } from '@nestjs/common';
import { BubbleBaseService } from '@impler/shared';
import { BubbleDestinationEntity } from '@impler/dal';

interface IThingsResponse {
  response: {
    cursor: number;
    count: number;
    remaining: number;
    results: Record<string, string | number>[];
  };
}

@Injectable()
export class BubbleIoService extends BubbleBaseService {
  async testConnection(data: Omit<BubbleDestinationEntity, '_id' | '_templateId'>) {
    try {
      const url = this.createBubbleIoUrl(data);
      const response = await axios.get<IThingsResponse>(url, {
        headers: {
          Authorization: `Bearer ${data.apiPrivateKey}`,
        },
      });
      if (!response.data.response.results.length)
        throw new Error('Datatype is empty. Please add at least one entry to the datatype');
    } catch (error: unknown) {
      this.throwRequestError(error as AxiosError);
    }
  }
}
