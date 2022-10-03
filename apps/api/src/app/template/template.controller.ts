import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { TemplateResponseDto } from './dtos/template-response.dto';
import { GetTemplates } from './usecases/get-templates/get-templates.usecase';

@Controller('/template')
@ApiTags('Template')
export class TemplateController {
  constructor(private getTemplatesUsecase: GetTemplates) {}

  @Get(':projectId')
  @ApiOperation({
    summary: 'Get project templates',
  })
  @ApiOkResponse({
    type: [TemplateResponseDto],
  })
  getTemplates(@Param('projectId') projectId: string): Promise<TemplateResponseDto[]> {
    return this.getTemplatesUsecase.execute(projectId);
  }
}
