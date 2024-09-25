import { IsString } from 'class-validator';

export class ApiKey {
  @IsString()
  role: string;

  @IsString()
  _userId: string;
}
