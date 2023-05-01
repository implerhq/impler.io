import { IsString } from 'class-validator';

export class ApiKey {
  @IsString()
  key: string;

  @IsString()
  _userId: string;
}
