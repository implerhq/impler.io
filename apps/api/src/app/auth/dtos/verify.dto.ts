import { IsDefined, IsString } from 'class-validator';

export class VerifyDto {
  @IsString()
  @IsDefined()
  otp: string;
}
