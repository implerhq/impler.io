import { IsNumber, IsOptional } from 'class-validator';
import { BaseCommand } from './base.command';

export class PaginationCommand extends BaseCommand {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
