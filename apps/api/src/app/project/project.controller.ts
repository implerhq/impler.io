import { Response } from 'express';
import { ApiOperation, ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';

import { ACCESS_KEY_NAME, IJwtPayload } from '@impler/shared';
import { UserSession } from '@shared/framework/user.decorator';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { ProjectResponseDto } from './dtos/project-response.dto';
import { CreateProjectRequestDto } from './dtos/create-project-request.dto';
import { UpdateProjectRequestDto } from './dtos/update-project-request.dto';
import { TemplateResponseDto } from 'app/template/dtos/template-response.dto';

import {
  GetProjects,
  GetTemplates,
  CreateProject,
  UpdateProject,
  DeleteProject,
  GetEnvironment,
  CreateProjectCommand,
  UpdateProjectCommand,
} from './usecases';
import { AuthService } from 'app/auth/services/auth.service';
import { CONSTANTS, COOKIE_CONFIG } from '@shared/constants';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { EnvironmentResponseDto } from 'app/environment/dtos/environment-response.dto';

@Controller('/project')
@ApiTags('Project')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(
    private getProjectsUsecase: GetProjects,
    private createProjectUsecase: CreateProject,
    private updateProjectUsecase: UpdateProject,
    private deleteProjectUsecase: DeleteProject,
    private authService: AuthService,
    private getTemplates: GetTemplates,
    private getEnvironment: GetEnvironment
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get projects',
  })
  @ApiOkResponse({
    type: [ProjectResponseDto],
  })
  getProjects(@UserSession() user: IJwtPayload): Promise<ProjectResponseDto[]> {
    return this.getProjectsUsecase.execute(user._id);
  }

  @Get(':projectId/templates')
  @ApiOperation({
    summary: 'Get all templates for project',
  })
  @ApiOkResponse({
    type: [TemplateResponseDto],
  })
  getTemplatesRoute(@Param('projectId', ValidateMongoId) projectId: string): Promise<TemplateResponseDto[]> {
    return this.getTemplates.execute(projectId);
  }

  @Get(':projectId/environment')
  @ApiOperation({
    summary: 'Get environment for project',
  })
  @ApiOkResponse({
    type: EnvironmentResponseDto,
  })
  getEnvironmentRoute(@Param('projectId', ValidateMongoId) projectId: string): Promise<EnvironmentResponseDto> {
    return this.getEnvironment.execute(projectId);
  }

  @Post('')
  @ApiOperation({
    summary: 'Create project',
  })
  @ApiOkResponse({
    type: ProjectResponseDto,
  })
  async createProject(
    @UserSession() user: IJwtPayload,
    @Body() body: CreateProjectRequestDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ project: ProjectResponseDto; environment: EnvironmentResponseDto }> {
    const projectWithEnvironment = await this.createProjectUsecase.execute(
      CreateProjectCommand.create({
        name: body.name,
        _userId: user._id,
      })
    );
    const token = this.authService.getSignedToken(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        accessToken: projectWithEnvironment.environment.apiKeys[0].key,
      },
      projectWithEnvironment.project._id
    );
    res.cookie(CONSTANTS.AUTH_COOKIE_NAME, token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    return projectWithEnvironment;
  }

  @Put(':projectId')
  @ApiOperation({
    summary: 'Update project',
  })
  @ApiOkResponse({
    type: ProjectResponseDto,
  })
  async updateProject(
    @UserSession() user: IJwtPayload,
    @Body() body: UpdateProjectRequestDto,
    @Param('projectId', ValidateMongoId) projectId: string
  ): Promise<ProjectResponseDto> {
    return this.updateProjectUsecase.execute(
      UpdateProjectCommand.create({ name: body.name, authHeaderName: body.authHeaderName }),
      projectId,
      user._id
    );
  }

  @Delete(':projectId')
  @ApiOperation({
    summary: 'Delete project',
  })
  @ApiOkResponse({
    type: ProjectResponseDto,
  })
  async deleteProject(
    @UserSession() user: IJwtPayload,
    @Param('projectId', ValidateMongoId) projectId: string
  ): Promise<ProjectResponseDto> {
    return await this.deleteProjectUsecase.execute(projectId, user._id);
  }
}
