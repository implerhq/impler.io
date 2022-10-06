import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { DocumentNotFoundException } from '../shared/exceptions/document-not-found.exception';
import { ValidateMongoId } from '../shared/validations/valid-mongo-id.validation';
import { CreateTemplateRequestDto } from './dtos/create-template-request.dto';
import { TemplateResponseDto } from './dtos/template-response.dto';
import { UpdateTemplateRequestDto } from './dtos/update-template-request.dto';
import { CreateTemplateCommand } from './usecases/create-template/create-template.command';
import { CreateTemplate } from './usecases/create-template/create-template.usecase';
import { DeleteTemplate } from './usecases/delete-template/delete-template.usecase';
import { GetTemplates } from './usecases/get-templates/get-templates.usecase';
import { UpdateTemplateCommand } from './usecases/update-template/update-template.command';
import { UpdateTemplate } from './usecases/update-template/update-template.usecase';

@Controller('/template')
@ApiTags('Template')
export class TemplateController {
  constructor(
    private getTemplatesUsecase: GetTemplates,
    private createTemplateUsecase: CreateTemplate,
    private updateTemplateUsecase: UpdateTemplate,
    private deleteTemplateUsecase: DeleteTemplate
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

  @Post(':projectId')
  @ApiOperation({
    summary: 'Add template in project',
  })
  @ApiOkResponse({
    type: TemplateResponseDto,
  })
  createTemplate(
    @Param('projectId', ValidateMongoId) projectId: string,
    @Body() body: CreateTemplateRequestDto
  ): Promise<TemplateResponseDto> {
    return this.createTemplateUsecase.execute(
      CreateTemplateCommand.create({
        _projectId: projectId,
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
  async updateTemplate(
    @Param('templateId', ValidateMongoId) templateId: string,
    @Body() body: UpdateTemplateRequestDto
  ): Promise<TemplateResponseDto> {
    const document = await this.updateTemplateUsecase.execute(
      UpdateTemplateCommand.create({
        _projectId: body._projectId,
        callbackUrl: body.callbackUrl,
        chunkSize: body.chunkSize,
        name: body.name,
      }),
      templateId
    );
    if (!document) {
      throw new DocumentNotFoundException('Template', templateId);
    }

    return document;
  }

  @Delete(':templateId')
  @ApiOperation({
    summary: 'Delete template',
  })
  @ApiOkResponse({
    type: TemplateResponseDto,
  })
  async deleteTemplate(@Param('templateId', ValidateMongoId) templateId: string): Promise<TemplateResponseDto> {
    const document = await this.deleteTemplateUsecase.execute(templateId);
    if (!document) {
      throw new DocumentNotFoundException('Template', templateId);
    }

    return document;
  }
}
