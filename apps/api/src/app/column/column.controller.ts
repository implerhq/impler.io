import { Controller, Put, Param, Body, Get, ParseArrayPipe } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ValidateMongoId } from '../shared/validations/valid-mongo-id.validation';
import { UpdateColumnRequestDto } from './dtos/update-column-request.dto';
import { UpdateColumnCommand } from './usecases/update-columns/update-columns.command';
import { UpdateColumns } from './usecases/update-columns/update-columns.usecase';
import { ColumnResponseDto } from './dtos/column-response.dto';
import { GetColumns } from './usecases/get-columns/get-columns.usecase';

@Controller('/column')
@ApiTags('Column')
export class ColumnController {
  constructor(private updateColumns: UpdateColumns, private getColumns: GetColumns) {}

  @Put(':templateId')
  @ApiOperation({
    summary: 'Update columns for Template',
  })
  @ApiBody({ type: [UpdateColumnRequestDto] })
  async updateTemplateColumns(
    @Param('templateId', ValidateMongoId) templateId: string,
    @Body(new ParseArrayPipe({ items: UpdateColumnRequestDto })) body: UpdateColumnRequestDto[]
  ): Promise<ColumnResponseDto[]> {
    return this.updateColumns.execute(
      body.map((columnData) =>
        UpdateColumnCommand.create({
          columnKeys: columnData.columnKeys,
          isRequired: columnData.isRequired,
          isUnique: columnData.isUnique,
          name: columnData.name,
          regex: columnData.regex,
          regexDescription: columnData.regexDescription,
          selectValues: columnData.selectValues,
          sequence: columnData.sequence,
          templateId: templateId,
          type: columnData.type,
        })
      ),
      templateId
    );
  }

  @Get(':templateId')
  @ApiOperation({
    summary: 'Get template columns',
  })
  async getTemplateColumns(@Param('templateId') templateId: string): Promise<ColumnResponseDto[]> {
    return this.getColumns.execute(templateId);
  }
}
