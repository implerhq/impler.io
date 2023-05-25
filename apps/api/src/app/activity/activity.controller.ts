import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Controller, Param, UseGuards, Get } from '@nestjs/common';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { UploadSummary } from './usecases';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';

@Controller('/activity')
@ApiTags('Activity')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class ActivityController {
  constructor(private uploadSummary: UploadSummary) {}

  @Get(':projectId/summary')
  @ApiOperation({
    summary: 'Get project upload summary',
  })
  async getUploadSummaryRoute(@Param('projectId', ValidateMongoId) _columnId: string) {
    return this.uploadSummary.execute(_columnId);
  }
}
