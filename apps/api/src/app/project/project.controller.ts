import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectResponseDto } from './dtos/projects-response.dto';
import { GetProjects } from './usecases/get-projects/get-projects.usecase';

@Controller('/project')
@ApiTags('Project')
export class ProjectController {
  constructor(private getProjectsUsecase: GetProjects) {}

  @Get('')
  @ApiOperation({
    summary: 'Get projects',
  })
  getProjects(): Promise<ProjectResponseDto[]> {
    return this.getProjectsUsecase.execute();
  }
}
