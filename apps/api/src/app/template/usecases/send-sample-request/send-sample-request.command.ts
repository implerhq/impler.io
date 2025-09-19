import { IsDefined, IsOptional, IsString, IsArray, IsObject } from 'class-validator';

export class SendSampleRequestCommand {
  @IsDefined()
  @IsString()
  _templateId: string;

  @IsArray()
  @IsOptional()
  rows?: Record<string, any>[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  description?: string;

  static create(data: Partial<SendSampleRequestCommand>): SendSampleRequestCommand {
    const command = new SendSampleRequestCommand();
    Object.assign(command, data);

    return command;
  }
}
