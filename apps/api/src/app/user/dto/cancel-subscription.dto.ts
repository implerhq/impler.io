import { IsArray, IsString } from 'class-validator';

export class CancelSubscriptionDto {
  @IsArray()
  @IsString({ each: true })
  reasons: string[];
}
