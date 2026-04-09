import { ApiTags, ApiBody, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Controller, Put, Param, Body, UseGuards, Post, Delete } from '@nestjs/common';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { ACCESS_KEY_NAME, IJwtPayload } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.guard';
import { UserSession } from '@shared/framework/user.decorator';
import { ColumnRequestDto } from './dtos/column-request.dto';
import { ColumnResponseDto } from './dtos/column-response.dto';
import { AddColumn, UpdateColumn, DeleteColumn } from './usecases';
import { UpdateColumnCommand } from './commands/update-column.command';

@Controller('/column')
@ApiTags('Column')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class ColumnController {
  constructor(
    private addColumn: AddColumn,
    private updateColumn: UpdateColumn,
    private deleteColumn: DeleteColumn
  ) {}

  @Post(':templateId')
  @ApiOperation({
    summary: 'Add column to template',
  })
  @ApiBody({ type: ColumnRequestDto })
  async addColumnToTemplate(
    @UserSession() user: IJwtPayload,
    @Param('templateId', ValidateMongoId) _templateId: string,
    @Body() body: ColumnRequestDto
  ): Promise<ColumnResponseDto> {
    return this.addColumn.execute(
      {
        ...body,
        _templateId,
      },
      _templateId,
      user._projectId
    );
  }

  @Put(':columnId')
  @ApiOperation({
    summary: 'Update column',
  })
  @ApiBody({ type: ColumnRequestDto })
  async updateColumnRoute(
    @UserSession() user: IJwtPayload,
    @Param('columnId', ValidateMongoId) _columnId: string,
    @Body() body: ColumnRequestDto
  ): Promise<ColumnResponseDto> {
    return this.updateColumn.execute(
      UpdateColumnCommand.create({
        ...body,
      }),
      _columnId,
      user._projectId
    );
  }

  @Delete(':columnId')
  @ApiOperation({
    summary: 'Delete column',
  })
  async deleteColumnRoute(
    @UserSession() user: IJwtPayload,
    @Param('columnId', ValidateMongoId) _columnId: string
  ): Promise<ColumnResponseDto> {
    return this.deleteColumn.execute(_columnId, user._projectId);
  }
}
