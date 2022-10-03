import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CreateProjectRequestDto } from './dtos/create-project-request.dto';
import { ProjectResponseDto } from './dtos/project-response.dto';
import { GetProjects } from './usecases/get-projects/get-projects.usecase';
import { CreateProject } from './usecases/create-project/create-project.usecase';
import { CreateProjectCommand } from './usecases/create-project/create-project.command';
import { UpdateProjectRequestDto } from './dtos/update-project-request.dto';
import { UpdateProject } from './usecases/update-project/update-project.usecase';
import { UpdateProjectCommand } from './usecases/update-project/update-project.command';

@Controller('/project')
@ApiTags('Project')
export class ProjectController {
  constructor(
    private getProjectsUsecase: GetProjects,
    private createProjectUsecase: CreateProject,
    private updateProjectUsecase: UpdateProject
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get projects',
  })
  @ApiOkResponse({
    type: [ProjectResponseDto],
  })
  getProjects(): Promise<ProjectResponseDto[]> {
    return this.getProjectsUsecase.execute();
  }

  @Post('')
  @ApiOperation({
    summary: 'Create project',
  })
  @ApiOkResponse({
    type: ProjectResponseDto,
  })
  createProject(@Body() body: CreateProjectRequestDto): Promise<ProjectResponseDto> {
    return this.createProjectUsecase.execute(
      CreateProjectCommand.create({
        code: body.code,
        name: body.name,
      })
    );
  }

  @Put(':projectId')
  @ApiOperation({
    summary: 'Update project',
  })
  @ApiOkResponse({
    type: ProjectResponseDto,
  })
  updateProject(
    @Body() body: UpdateProjectRequestDto,
    @Param('projectId') projectId: string
  ): Promise<ProjectResponseDto> {
    return this.updateProjectUsecase.execute(UpdateProjectCommand.create({ name: body.name }), projectId);
  }
}
