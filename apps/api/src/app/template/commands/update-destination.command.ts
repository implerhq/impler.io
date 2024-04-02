import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDefined,
  IsUrl,
  ValidateIf,
  ValidateNested,
  IsObject,
  IsNotEmptyObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseCommand } from '@shared/commands/base.command';
import { BubbleDestinationEnvironmentEnum, DestinationsEnum } from '@impler/shared';

export class WebhookDestinationObject {
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

export class BubbleIoDestinationObject {
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

export class UpdateDestinationCommand extends BaseCommand {
  @IsOptional()
  @IsEnum(DestinationsEnum)
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
