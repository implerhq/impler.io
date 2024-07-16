import { IsArray, IsDate, IsString } from 'class-validator';

export class UpdateJobInfoDto {
  @IsString()
  url: string;

  @IsString()
  _templateId: string;

  @IsString()
  cron: string;

  @IsArray()
  headings: string[];

  @IsDate()
  createdOn: Date;
}
