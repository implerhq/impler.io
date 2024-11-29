import { PaginationCommand } from '@shared/commands/pagination.command';
import { IsString } from 'class-validator';

export class GetTransactionHistoryCommand extends PaginationCommand {
  @IsString()
  projectId: string;
}
