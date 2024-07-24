import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserJob, GetColumnSchemaMapping, CreateJobMapping, UpdateUserJob, GetUserJob } from './usecase';
import { CronJobService } from '../shared/services/cronjob.service';
import { UpdateJobMappingDto } from './dtos/update-jobmapping.dto';
import { UpdateJobInfoDto } from './dtos/update-jobinfo.dto';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { CreateUserJobDto } from './dtos/create-userjob.dto';

@ApiTags('Import-Jobs')
@Controller('/import-jobs')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class ImportJobsController {
  constructor(
    private createUserJob: CreateUserJob,
    private getColumnSchemaMapping: GetColumnSchemaMapping,
    private getUserJob: GetUserJob,
    private updateJobMapping: CreateJobMapping,
    private updateUserJob: UpdateUserJob,
    private cronJobService: CronJobService
  ) {}

  @Post(':templateId')
  @ApiOperation({ summary: 'Create User Job' })
  @ApiSecurity(ACCESS_KEY_NAME)
  async createUserJobRoute(@Param('templateId') templateId: string, @Body() createUserJobData: CreateUserJobDto) {
    return this.createUserJob.execute({
      _templateId: templateId,
      url: createUserJobData.url,
    });
  }

  @Get(':jobId/mappings')
  @ApiOperation({ summary: 'Fetch the Import Job Information based on jobId' })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity(ACCESS_KEY_NAME)
  async getImportJobInfoRoute(@Param('jobId') _jobId: string) {
    return this.getColumnSchemaMapping.execute(_jobId);
  }

  @Put(':jobId/mappings')
  @ApiOperation({ summary: 'Update Mappings Route' })
  @UseGuards(JwtAuthGuard)
  async updateJobMappingRoute(
    @Body(new ParseArrayPipe({ items: UpdateJobMappingDto, optional: true })) body: UpdateJobMappingDto[]
  ) {
    return this.updateJobMapping.execute(body);
  }

  @Put(':jobId')
  @ApiOperation({ summary: 'Update UserJob Fields' })
  @UseGuards(JwtAuthGuard)
  async updateUserJobRoute(@Param('jobId') _jobId: string, @Body() userJobData: UpdateJobInfoDto) {
    return this.updateUserJob.execute(_jobId, userJobData);
  }

  @Get('/user/:externalUserId')
  @ApiOperation({ summary: 'Get Import Jobs for a User' })
  @UseGuards(JwtAuthGuard)
  async getUserJobs(@Param('externalUserId') externalUserId: string) {
    return this.getUserJob.execute(externalUserId);
  }

  @Put('/user/:jobId/pause')
  @ApiOperation({ summary: 'Pause a Cron Job' })
  @UseGuards(JwtAuthGuard)
  async pauseCronJob(@Param('jobId') jobId: string) {
    return await this.cronJobService.pauseJob(jobId);
  }

  @Put('/user/:jobId/start')
  @ApiOperation({ summary: 'Start a Cron Job' })
  @UseGuards(JwtAuthGuard)
  async startCronJob(@Param('jobId') jobId: string) {
    return await this.cronJobService.startJob(jobId);
  }

  @Delete('/user/:externalUserId/:jobId')
  @ApiOperation({ summary: 'Delete a Job' })
  @UseGuards(JwtAuthGuard)
  async deleteJob(@Param('externalUserId') externalUserId: string, @Param('jobId') jobId: string) {
    return await this.cronJobService.deleteJob(externalUserId, jobId);
  }

  @Delete(':jobId')
  @ApiOperation({ summary: 'Delete and Update the status of UserJob' })
  @UseGuards(JwtAuthGuard)
  async deleteJobRoute(@Param('jobId') _jobId: string) {
    return await this.cronJobService.deleteUserJob(_jobId);
  }

  @Put('/user/:jobId/resume')
  @ApiOperation({ summary: 'Resume the Paused UserJob' })
  @UseGuards(JwtAuthGuard)
  async resumeUserJobRoute(@Param('jobId') _jobId: string) {
    return await this.cronJobService.resumeJob(_jobId);
  }
}
