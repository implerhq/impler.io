import axios, { AxiosError } from 'axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BubbleDestinationEntity } from '@impler/dal';
import { BubbleDestinationEnvironmentEnum } from '@impler/shared';

interface IThingsResponse {
  response: {
    cursor: number;
    count: number;
    remaining: number;
    results: Record<string, string | number>[];
  };
}

@Injectable()
export class BubbleIoService {
  async testConnection(data: Omit<BubbleDestinationEntity, '_id' | '_templateId'>) {
    try {
      let url = data.customDomainName ? `https://${data.customDomainName}` : `https://${data.appName}.bubbleapps.io`;
      if (data.environment === BubbleDestinationEnvironmentEnum.DEVELOPMENT) url += '/version-test';
      const response = await axios.get<IThingsResponse>(`${url}/api/1.1/obj/${data.datatype}`, {
        headers: {
          Authorization: `Bearer ${data.apiPrivateKey}`,
        },
      });
      if (!response.data.response.results.length) throw new Error('Datatype is empty');
    } catch (error: unknown) {
      const errorWithType = error as AxiosError;
      if ((errorWithType as AxiosError).response) {
        // Request made and server responded
        const response = errorWithType.response.data as Record<string, any>;
        if (response?.translation) throw new BadRequestException(response?.translation);
        else if (response.body?.message) throw new BadRequestException(response.body?.message);
        else if (response.includes('invalid appname hosted on bubbleapps.io'))
          throw new BadRequestException('Invalid App Name');
        else if (errorWithType.response.status === 401)
          throw new BadRequestException(
            `You're not authorized to access this app. Please check "App Name" or "API Private Key"`
          );
        Logger.log('response error', response, errorWithType.response);
      } else if ((errorWithType as AxiosError).request) {
        if (errorWithType.message.includes('ECONNRESET')) throw new BadRequestException('Cannot connect to app');
        if (errorWithType.message.includes('getaddrinfo'))
          throw new BadRequestException('Cannot connect to app. Please check "App Name" or "CustomDomain Name"');
        Logger.log('request error', errorWithType.message, errorWithType.request);
      } else {
        Logger.log('unknown error', errorWithType.message);
      }
      throw new BadRequestException({
        message: errorWithType.message,
      });
    }
  }
}
