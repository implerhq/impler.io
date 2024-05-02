import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationCommand } from '@shared/commands/pagination.command';

export class UploadHistoryCommand extends PaginationCommand {
  @IsDefined()
  @IsMongoId()
  _projectId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  date?: string;
}
