import { ApiTags, ApiBody, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Controller, Put, Param, Body, Get, ParseArrayPipe, UseGuards, Post } from '@nestjs/common';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { APIKeyGuard } from '@shared/framework/auth.gaurd';
import { ACCESS_KEY_NAME } from '@impler/shared';

import { ColumnRequestDto } from './dtos/column-request.dto';
import { ColumnResponseDto } from './dtos/column-response.dto';
import { AddColumnCommand } from './commands/add-column.command';
import { UpdateColumnCommand } from './commands/update-column.command';
import { GetColumns, UpdateColumns, AddColumn, UpdateColumn } from './usecases';

@Controller('/column')
@ApiTags('Column')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(APIKeyGuard)
export class ColumnController {
  constructor(
    private updateColumns: UpdateColumns,
    private getColumns: GetColumns,
    private addColumn: AddColumn,
    private updateColumn: UpdateColumn
  ) {}

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

  @Put(':templateId/all')
  @ApiOperation({
    summary: 'Update columns for Template',
  })
  @ApiBody({ type: [ColumnRequestDto] })
  async updateTemplateColumns(
    @Param('templateId', ValidateMongoId) _templateId: string,
    @Body(new ParseArrayPipe({ items: ColumnRequestDto })) body: ColumnRequestDto[]
  ): Promise<ColumnResponseDto[]> {
    return this.updateColumns.execute(
      body.map((columnData) =>
        AddColumnCommand.create({
          key: columnData.key,
          alternateKeys: columnData.alternateKeys,
          isRequired: columnData.isRequired,
          isUnique: columnData.isUnique,
          name: columnData.name,
          regex: columnData.regex,
          regexDescription: columnData.regexDescription,
          selectValues: columnData.selectValues,
          sequence: columnData.sequence,
          _templateId,
          type: columnData.type,
          apiResponseKey: columnData.apiResponseKey,
        })
      ),
      _templateId
    );
  }

  @Get(':templateId')
  @ApiOperation({
    summary: 'Get template columns',
  })
  async getTemplateColumns(@Param('templateId') _templateId: string): Promise<ColumnResponseDto[]> {
    return this.getColumns.execute(_templateId);
  }
}
