import { ApiTags, ApiBody, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Controller, Put, Param, Body, UseGuards, Post, Delete } from '@nestjs/common';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { APIKeyGuard } from '@shared/framework/auth.gaurd';
import { ACCESS_KEY_NAME } from '@impler/shared';

import { ColumnRequestDto } from './dtos/column-request.dto';
import { ColumnResponseDto } from './dtos/column-response.dto';
import { AddColumnCommand } from './commands/add-column.command';
import { AddColumn, UpdateColumn, DeleteColumn } from './usecases';
import { UpdateColumnCommand } from './commands/update-column.command';

@Controller('/column')
@ApiTags('Column')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(APIKeyGuard)
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
        key: body.key,
        alternateKeys: body.alternateKeys,
        isRequired: body.isRequired,
        isUnique: body.isUnique,
        name: body.name,
        regex: body.regex,
        regexDescription: body.regexDescription,
        selectValues: body.selectValues,
        sequence: body.sequence,
        _templateId,
        type: body.type,
        apiResponseKey: body.apiResponseKey,
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
