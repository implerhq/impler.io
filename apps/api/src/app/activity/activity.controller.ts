import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Controller, Param, UseGuards, Get, Query } from '@nestjs/common';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { UploadSummary, UploadHistory } from './usecases';
import { ACCESS_KEY_NAME, Defaults } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';

@Controller('/activity')
@ApiTags('Activity')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class ActivityController {
  constructor(private uploadSummary: UploadSummary, private uploadHistory: UploadHistory) {}

  @Get(':projectId/summary')
  @ApiOperation({
    summary: 'Get project upload summary',
  })
  async getUploadSummaryRoute(@Param('projectId', ValidateMongoId) _columnId: string) {
    return this.uploadSummary.execute(_columnId);
  }

  @Get(':projectId/history')
  @ApiOperation({
    summary: 'Get project upload history',
  })
  async getUploadHistoryRoute(
    @Param('projectId', ValidateMongoId) _projectId: string,
    @Query('name') name?: string,
    @Query('page') page = Defaults.ONE,
    @Query('limit') limit = Defaults.PAGE_LIMIT
  ) {
    if (isNaN(page)) page = Defaults.ONE;
    else page = Number(page);
    if (isNaN(limit)) limit = Defaults.PAGE_LIMIT;
    else limit = Number(limit);

    return this.uploadHistory.execute(_projectId, name, page, limit);
  }
}
