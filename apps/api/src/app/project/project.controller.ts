import { Response } from 'express';
import { ApiOperation, ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';

import { ACCESS_KEY_NAME, Defaults, IJwtPayload, PaginationResult, UserRolesEnum } from '@impler/shared';
import { UserSession } from '@shared/framework/user.decorator';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { ProjectResponseDto } from './dtos/project-response.dto';
import { CreateProjectRequestDto } from './dtos/create-project-request.dto';
import { UpdateProjectRequestDto } from './dtos/update-project-request.dto';
import { TemplateListResponseDto } from './dtos/template-list-response.dto';
import { ImportListResponseDto } from './dtos/import-list-response.dto';

import {
  GetImports,
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
    private getImports: GetImports,
    private getProjectsUsecase: GetProjects,
    private createProjectUsecase: CreateProject,
    private updateProjectUsecase: UpdateProject,
    private deleteProjectUsecase: DeleteProject,
    private authService: AuthService,
    private getTemplates: GetTemplates,
    private getEnvironment: GetEnvironment
  ) {}

  @Get()
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
    type: [TemplateListResponseDto],
  })
  getTemplatesRoute(@Param('projectId', ValidateMongoId) projectId: string): Promise<TemplateListResponseDto[]> {
    return this.getTemplates.execute(projectId);
  }

  @Get(':projectId/imports')
  @ApiOperation({
    summary: 'Get all imports for project',
  })
  @ApiOkResponse({
    type: [ImportListResponseDto],
  })
  getImportsRoute(
    @Param('projectId', ValidateMongoId) _projectId: string,
    @Query('page') page = Defaults.ONE,
    @Query('limit') limit = Defaults.PAGE_LIMIT,
    @Query('search') search: string
  ): Promise<PaginationResult<ImportListResponseDto>> {
    if (isNaN(page)) page = Defaults.ONE;
    else page = Number(page);
    if (isNaN(limit)) limit = Defaults.PAGE_LIMIT;
    else limit = Number(limit);

    return this.getImports.execute({
      _projectId,
      limit,
      page,
      search,
    });
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

  @Post()
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
        ...body,
        _userId: user._id,
      })
    );
    const userApiKey = projectWithEnvironment.environment.apiKeys.find(
      (apiKey) => apiKey._userId.toString() === user._id
    );

    const token = this.authService.getSignedToken(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: userApiKey.role as UserRolesEnum,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
        accessToken: projectWithEnvironment.environment.key,
      },
      projectWithEnvironment.project._id
    );
    res.cookie(CONSTANTS.AUTH_COOKIE_NAME, token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    return projectWithEnvironment;
  }

  @Put('/switch/:projectId')
  @ApiOperation({
    summary: 'Switch project',
  })
  async switchProject(
    @UserSession() user: IJwtPayload,
    @Param('projectId', ValidateMongoId) projectId: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const projectEnvironment = await this.getEnvironment.execute(projectId);
    const userApiKey = projectEnvironment.apiKeys.find((apiKey) => apiKey._userId.toString() === user._id.toString());

    const token = this.authService.getSignedToken(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: userApiKey.role as UserRolesEnum,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture,
        accessToken: projectEnvironment.key,
      },
      projectEnvironment._projectId
    );
    res.cookie(CONSTANTS.AUTH_COOKIE_NAME, token, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    return token;
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
