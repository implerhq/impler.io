import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, UseGuards } from '@nestjs/common';
import {
  CreateUserJob,
  GetColumnSchemaMapping,
  CreateJobMapping,
  UpdateUserJob,
  GetUserJob,
  UserJobPause,
  UserJobResume,
  UserJobTerminate,
  UserJobDelete,
} from './usecase';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { UpdateJobDto, CreateUserJobDto, UpdateJobMappingDto } from './dtos';

@ApiTags('Import-Jobs')
@Controller('/import-jobs')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class ImportJobsController {
  constructor(
    private createUserJob: CreateUserJob,
    private updateJobMapping: CreateJobMapping,
    private getColumnSchemaMapping: GetColumnSchemaMapping,
    private getUserJob: GetUserJob,
    private updateUserJob: UpdateUserJob,
    private userJobPause: UserJobPause,
    private userJobResume: UserJobResume,
    private userJobDelete: UserJobDelete,
    private userJobTerminate: UserJobTerminate
  ) {}

  @Post(':templateId')
  @ApiOperation({ summary: 'Create User-Job' })
  @ApiSecurity(ACCESS_KEY_NAME)
  async createUserJobRoute(@Param('templateId') templateId: string, @Body() createUserJobData: CreateUserJobDto) {
    return this.createUserJob.execute({
      _templateId: templateId,
      url: createUserJobData.url,
      extra: createUserJobData.extra,
      externalUserId: createUserJobData.externalUserId,
    });
  }

  @Get(':jobId/mappings')
  @ApiOperation({ summary: 'Fetch the User-Job Mapping Information based on jobId' })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity(ACCESS_KEY_NAME)
  async getImportJobInfoRoute(@Param('jobId') _jobId: string) {
    return this.getColumnSchemaMapping.execute(_jobId);
  }

  @Put(':jobId/mappings')
  @ApiOperation({ summary: 'Update User-Job Mappings' })
  @UseGuards(JwtAuthGuard)
  async updateJobMappingRoute(@Body(new ParseArrayPipe({ items: UpdateJobMappingDto })) body: UpdateJobMappingDto[]) {
    return this.updateJobMapping.execute(body);
  }

  @Put(':jobId')
  @ApiOperation({ summary: 'Update User-Job Fields' })
  @UseGuards(JwtAuthGuard)
  async updateUserJobRoute(@Param('jobId') _jobId: string, @Body() userJobData: UpdateJobDto) {
    return this.updateUserJob.execute(_jobId, userJobData);
  }

  @Get('/user/:externalUserId')
  @ApiOperation({ summary: 'Get User Jobs' })
  @UseGuards(JwtAuthGuard)
  async getUserJobs(@Param('externalUserId') externalUserId: string) {
    return this.getUserJob.execute(externalUserId);
  }

  @Put('/user/:jobId/pause')
  @ApiOperation({ summary: 'Pause User-Job from Running' })
  @UseGuards(JwtAuthGuard)
  async pauseCronJob(@Param('jobId') jobId: string) {
    return await this.userJobPause.execute(jobId);
  }

  @Put('/user/:jobId/resume')
  @ApiOperation({ summary: 'Resume stopped User-Job' })
  @UseGuards(JwtAuthGuard)
  async resumeUserJobRoute(@Param('jobId') _jobId: string) {
    return await this.userJobResume.execute(_jobId);
  }

  @Delete('/user/:externalUserId/:jobId')
  @ApiOperation({ summary: 'Delete User-Job' })
  @UseGuards(JwtAuthGuard)
  async deleteJob(@Param('externalUserId') externalUserId: string, @Param('jobId') _jobId: string) {
    return await this.userJobDelete.execute({ externalUserId, _jobId });
  }

  @Delete(':jobId')
  @ApiOperation({ summary: 'Delete User-Job and Update the status of UserJob to TERMINATED' })
  @UseGuards(JwtAuthGuard)
  async deleteJobRoute(@Param('jobId') _jobId: string) {
    return await this.userJobTerminate.execute(_jobId);
  }
}
