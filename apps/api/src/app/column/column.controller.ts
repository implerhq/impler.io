import { ApiTags, ApiBody, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Controller, Put, Param, Body, UseGuards, Post, Delete } from '@nestjs/common';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { ACCESS_KEY_NAME } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { ColumnRequestDto } from './dtos/column-request.dto';
import { ColumnResponseDto } from './dtos/column-response.dto';
import { AddColumnCommand } from './commands/add-column.command';
import { AddColumn, UpdateColumn, DeleteColumn } from './usecases';
import { UpdateColumnCommand } from './commands/update-column.command';

@Controller('/column')
@ApiTags('Column')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class ColumnController {
  constructor(private addColumn: AddColumn, private updateColumn: UpdateColumn, private deleteColumn: DeleteColumn) {}

  @Post(':templateId')
  @ApiOperation({
    summary: 'Add column to template',
  })
  @ApiBody({ type: ColumnRequestDto })
  async addColumnToTemplate(
    @Param('templateId', ValidateMongoId) _templateId: string,
    @Body() body: ColumnRequestDto
  ): Promise<ColumnResponseDto> {
    return this.addColumn.execute(
      AddColumnCommand.create({
        ...body,
        _templateId,
      }),
      _templateId
    );
  }

  @Put(':columnId')
  @ApiOperation({
    summary: 'Update column',
  })
  @ApiBody({ type: ColumnRequestDto })
  async updateColumnRoute(
    @Param('columnId', ValidateMongoId) _columnId: string,
    @Body() body: ColumnRequestDto
  ): Promise<ColumnResponseDto> {
    return this.updateColumn.execute(
      UpdateColumnCommand.create({
        ...body,
      }),
      _columnId
    );
  }

  @Delete(':columnId')
  @ApiOperation({
    summary: 'Delete column',
  })
  async deleteColumnRoute(@Param('columnId', ValidateMongoId) _columnId: string): Promise<ColumnResponseDto> {
    return this.deleteColumn.execute(_columnId);
  }
}
