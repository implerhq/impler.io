import { Response } from 'express';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';

import { IJwtPayload } from '@impler/shared';
import { UserSession } from '@shared/framework/user.decorator';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { ProjectResponseDto } from './dtos/project-response.dto';
import { CreateProjectRequestDto } from './dtos/create-project-request.dto';
import { UpdateProjectRequestDto } from './dtos/update-project-request.dto';
import {
  GetProjects,
  CreateProject,
  UpdateProject,
  DeleteProject,
  AddMember,
  AddMemberCommand,
  CreateProjectCommand,
  UpdateProjectCommand,
} from './usecases';
import { AuthService } from 'app/auth/services/auth.service';
import { CONSTANTS, COOKIE_CONFIG } from '@shared/constants';

@Controller('/project')
@ApiTags('Project')
export class ProjectController {
  constructor(
    private getProjectsUsecase: GetProjects,
    private createProjectUsecase: CreateProject,
    private updateProjectUsecase: UpdateProject,
    private deleteProjectUsecase: DeleteProject,
    private addMember: AddMember,
    private authService: AuthService
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
  ): Promise<ProjectResponseDto> {
    const project = await this.createProjectUsecase.execute(
      CreateProjectCommand.create({
        name: body.name,
        authHeaderName: body.authHeaderName,
      })
    );
    const member = await this.addMember.execute(
      AddMemberCommand.create({
        _projectId: project._id,
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
      },
      project._id,
      member.role
    );
    res.cookie(CONSTANTS.AUTH_COOKIE_NAME, token, COOKIE_CONFIG);

    return project;
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
