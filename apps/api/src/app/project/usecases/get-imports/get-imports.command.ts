import { IsDefined, IsString } from 'class-validator';
import { PaginationCommand } from '@shared/commands/pagination.command';

export class GetImportsCommand extends PaginationCommand {
  @IsDefined()
  @IsString()
  _projectId: string;
}
