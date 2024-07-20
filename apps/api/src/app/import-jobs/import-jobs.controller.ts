import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserJob, GetJobMapping, CreateJobMapping, UpdateUserJob } from './usecase';
import { CronJobService } from '../shared/services/cronjob.service';
import { UpdateJobMappingDto } from './dtos/update-jobmapping.dto';
import { UpdateJobInfoDto } from './dtos/update-jobinfo.dto';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { ACCESS_KEY_NAME } from '@impler/shared';

@ApiTags('Import-Jobs')
@Controller('/import-jobs')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class ImportJobsController {
  constructor(
    private createUserJob: CreateUserJob,
    private getJobMapping: GetJobMapping,
    private updateJobMapping: CreateJobMapping,
    private updateUserJob: UpdateUserJob,
    private cronJobService: CronJobService
  ) {}
  @Post(':templateId')
  @ApiOperation({ summary: 'Create User Job' })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity(ACCESS_KEY_NAME)
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
  async getImportJobInfoRoute(@Param('jobId') _jobId: string) {
    return this.getJobMapping.execute(_jobId);
  }

  @Put(':jobId/mappings')
  @ApiOperation({ summary: 'Update Mappings Route' })
  @UseGuards(JwtAuthGuard)
  async updateMappingRoute(
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

  @Get('/user/:id')
  @ApiOperation({ summary: 'Get Import Jobs for a User' })
  @UseGuards(JwtAuthGuard)
  async getUserJobs(@Param('id') userId: string) {
    return this.getJobMapping.getUserJobs(userId);
  }

  @Put('/user/:id/:jobId/pause')
  @ApiOperation({ summary: 'Pause a Cron Job' })
  @UseGuards(JwtAuthGuard)
  async pauseCronJob(@Param('jobId') jobId: string) {
    return this.cronJobService.pauseJob(jobId);
  }

  @Put('/user/:id/:jobId/start')
  @ApiOperation({ summary: 'Start a Cron Job' })
  @UseGuards(JwtAuthGuard)
  async startCronJob(@Param('id') userId: string, @Param('jobId') jobId: string) {
    return this.cronJobService.startJob(userId, jobId);
  }

  @Delete('/user/:id/:jobId/delete')
  @ApiOperation({ summary: 'Delete a Job' })
  @UseGuards(JwtAuthGuard)
  async deleteJob(@Param('id') userId: string, @Param('jobId') jobId: string) {
    return this.cronJobService.deleteJob(userId, jobId);
  }
}
