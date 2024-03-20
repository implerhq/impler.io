import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDefined,
  IsUrl,
  ValidateIf,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { BubbleDestinationEnvironmentEnum, DestinationsEnum } from '@impler/shared';
import { Type } from 'class-transformer';

class WebhookDestinationObject {
  @IsUrl()
  @IsDefined()
  callbackUrl?: string;

  @IsString()
  @IsOptional()
  authHeaderName?: string;

  @IsNumber({
    allowNaN: false,
  })
  @IsDefined()
  chunkSize?: number;
}

class BubbleIoDestinationObject {
  @IsString()
  @IsDefined()
  @ValidateIf((obj) => obj.destination === DestinationsEnum.BUBBLEIO)
  appName: string;

  @IsString()
  @IsDefined()
  @ValidateIf((obj) => obj.destination === DestinationsEnum.BUBBLEIO)
  apiPrivateKey: string;

  @IsString()
  @IsDefined()
  @ValidateIf((obj) => obj.destination === DestinationsEnum.BUBBLEIO)
  datatype: string;

  @IsEnum(BubbleDestinationEnvironmentEnum)
  @IsDefined()
  @ValidateIf((obj) => obj.destination === DestinationsEnum.BUBBLEIO)
  environment: BubbleDestinationEnvironmentEnum;

  @IsString()
  @IsOptional()
  @ValidateIf((obj) => obj.destination === DestinationsEnum.BUBBLEIO)
  customDomainName?: string;
}

export class UpdateDestinationDto {
  @IsEnum(DestinationsEnum)
  @IsOptional()
  destination?: DestinationsEnum;

  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => WebhookDestinationObject)
  @ValidateIf((obj) => obj.destination === DestinationsEnum.WEBHOOK)
  webhook?: WebhookDestinationObject;

  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => BubbleIoDestinationObject)
  @ValidateIf((obj) => obj.destination === DestinationsEnum.BUBBLEIO)
  bubbleIo?: BubbleIoDestinationObject;
}
