import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Controller, Param, UseGuards, Get, Query, Post } from '@nestjs/common';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { UploadSummary, UploadHistory, RetryUpload, WebhookLogs } from './usecases';
import { ACCESS_KEY_NAME, Defaults } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { isDateString } from '@shared/helpers/common.helper';

@Controller('/activity')
@ApiTags('Activity')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class ActivityController {
  constructor(
    private uploadSummary: UploadSummary,
    private uploadHistory: UploadHistory,
    private retryUpload: RetryUpload,
    private webhookLogs: WebhookLogs
  ) {}

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
    @Query('limit') limit = Defaults.PAGE_LIMIT,
    @Query('date') date?: string
  ) {
    if (isNaN(page)) page = Defaults.ONE;
    else page = Number(page);
    if (isNaN(limit)) limit = Defaults.PAGE_LIMIT;
    else limit = Number(limit);
    if (!isDateString(date)) {
      date = undefined;
    }

    return this.uploadHistory.execute({
      _projectId,
      name,
      date,
      page,
      limit,
    });
  }

  @Post(':uploadId/retry')
  @ApiOperation({
    summary: 'Retry webhook data for a specific upload',
  })
  async retryUploadRoute(@Param('uploadId', ValidateMongoId) uploadId: string) {
    return this.retryUpload.execute(uploadId);
  }

  @Get('upload/:uploadId/webhook-logs')
  @ApiOperation({
    summary: 'Get webhook logs for a specific upload',
  })
  async getWebhookLogsRoute(
    @Param('uploadId', ValidateMongoId) uploadId: string,
    @Query('page') page = Defaults.ONE,
    @Query('limit') limit = Defaults.PAGE_LIMIT,
    @Query('isRetry') isRetry?: boolean
  ) {
    if (isNaN(page)) page = Defaults.ONE;
    else page = Number(page);
    if (isNaN(limit)) limit = Defaults.PAGE_LIMIT;
    else limit = Number(limit);

    return this.webhookLogs.execute({
      uploadId,
      page,
      limit,
      isRetry,
    });
  }
}
