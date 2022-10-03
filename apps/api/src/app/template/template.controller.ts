import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CreateTemplateRequestDto } from './dtos/create-template-request.dto';
import { TemplateResponseDto } from './dtos/template-response.dto';
import { CreateTemplateCommand } from './usecases/create-template/create-template.command';
import { CreateTemplate } from './usecases/create-template/create-template.usecase';
import { GetTemplates } from './usecases/get-templates/get-templates.usecase';

@Controller('/template')
@ApiTags('Template')
export class TemplateController {
  constructor(private getTemplatesUsecase: GetTemplates, private createTemplateUsecase: CreateTemplate) {}

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

  @Post('')
  @ApiOperation({
    summary: 'Create template',
  })
  @ApiOkResponse({
    type: TemplateResponseDto,
  })
  createTemplate(@Body() body: CreateTemplateRequestDto): Promise<TemplateResponseDto> {
    return this.createTemplateUsecase.execute(
      CreateTemplateCommand.create({
        _projectId: body._projectId,
        callbackUrl: body.callbackUrl,
        chunkSize: body.chunkSize,
        code: body.code,
        name: body.name,
      })
    );
  }
}
