import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserJob, GetImportJobInfo } from './usecase';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { GetImportMappingInfo } from './usecase/get-mapping/get-mapping.usecase';

@ApiTags('Import-Jobs')
@Controller('/import-jobs')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class ImportJobsController {
  constructor(
    private createUserJob: CreateUserJob,
    private getImportJobInfo: GetImportJobInfo,
    private getImportMappingInfo: GetImportMappingInfo
  ) {}
  @Post(':templateId')
  @ApiOperation({ summary: 'Create User Job' })
  async createUserJobRoute(@Param('templateId') templateId: string, @Body() body: { url: string }) {
    return this.createUserJob.execute({
      _templateId: templateId,
      url: body.url,
    });
  }

  @Get(':jobId/mappings')
  @ApiOperation({ summary: 'Fetch the Import Job Information based on jobId' })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity(ACCESS_KEY_NAME)
  async getImportJobInfoRoute(@Param('jobId') jobId: string, templateId: string) {
    return this.getImportJobInfo.execute(jobId, templateId);
  }

  @Get(':templateId')
  async getMapppingSchemaRoute(@Param('templateId') templateId: string) {
    return this.getImportMappingInfo.execute(templateId);
  }
}
