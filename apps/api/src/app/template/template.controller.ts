import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ValidateMongoId } from '../shared/validations/valid-mongo-id.validation';
import { CreateTemplateRequestDto } from './dtos/create-template-request.dto';
import { TemplateResponseDto } from './dtos/template-response.dto';
import { UpdateTemplateRequestDto } from './dtos/update-template-request.dto';
import { CreateTemplateCommand } from './usecases/create-template/create-template.command';
import { CreateTemplate } from './usecases/create-template/create-template.usecase';
import { GetTemplates } from './usecases/get-templates/get-templates.usecase';
import { UpdateTemplateCommand } from './usecases/update-template/update-template.command';
import { UpdateTemplate } from './usecases/update-template/update-template.usecase';

@Controller('/template')
@ApiTags('Template')
export class TemplateController {
  constructor(
    private getTemplatesUsecase: GetTemplates,
    private createTemplateUsecase: CreateTemplate,
    private updateTemplateUsecase: UpdateTemplate
  ) {}

  @Get(':projectId')
  @ApiOperation({
    summary: 'Get project templates',
  })
  @ApiOkResponse({
    type: [TemplateResponseDto],
  })
  getTemplates(@Param('projectId', ValidateMongoId) projectId: string): Promise<TemplateResponseDto[]> {
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

  @Put(':templateId')
  @ApiOperation({
    summary: 'Update template',
  })
  @ApiOkResponse({
    type: TemplateResponseDto,
  })
  updateTemplate(
    @Param('templateId', ValidateMongoId) templateId: string,
    @Body() body: UpdateTemplateRequestDto
  ): Promise<TemplateResponseDto> {
    return this.updateTemplateUsecase.execute(
      UpdateTemplateCommand.create({
        _projectId: body._projectId,
        callbackUrl: body.callbackUrl,
        chunkSize: body.chunkSize,
        name: body.name,
      }),
      templateId
    );
  }
}
