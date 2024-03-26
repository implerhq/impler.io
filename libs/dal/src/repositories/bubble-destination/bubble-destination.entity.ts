import { BubbleDestinationEnvironmentEnum } from '@impler/shared';

export class BubbleDestinationEntity {
  _id?: string;

  appName: string;

  customDomainName?: string;

  environment: BubbleDestinationEnvironmentEnum;

  apiPrivateKey: string;

  datatype: string;

  _templateId: string;
}
