import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CreateProjectDto } from './dtos/create-project.dto';
import { ProjectResponseDto } from './dtos/projects-response.dto';
import { GetProjects } from './usecases/get-projects/get-projects.usecase';
import { CreateProject } from './usecases/create-project/create-project.usecase';
import { CreateProjectCommand } from './usecases/create-project/create-project.command';
import { CreateProjectResponseDto } from './dtos/create-project-response.dto';

@Controller('/project')
@ApiTags('Project')
export class ProjectController {
  constructor(private getProjectsUsecase: GetProjects, private createProjectUsecase: CreateProject) {}

  @Get('')
  @ApiOperation({
    summary: 'Get projects',
  })
  getProjects(): Promise<ProjectResponseDto[]> {
    return this.getProjectsUsecase.execute();
  }

  @Post('')
  @ApiOperation({
    summary: 'Create project',
  })
  @ApiOkResponse({
    type: [CreateProjectResponseDto],
  })
  createProject(@Body() body: CreateProjectDto): Promise<CreateProjectResponseDto> {
    return this.createProjectUsecase.execute(
      CreateProjectCommand.create({
        code: body.code,
        name: body.name,
      })
    );
  }
}
