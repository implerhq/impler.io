import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';
import { UploadEntity } from '@impler/dal';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { APIKeyGuard } from '@shared/framework/auth.gaurd';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { CreateTemplateRequestDto } from './dtos/create-template-request.dto';
import { TemplateResponseDto } from './dtos/template-response.dto';
import { UpdateTemplateRequestDto } from './dtos/update-template-request.dto';
import { CreateTemplateCommand } from './usecases/create-template/create-template.command';
import { CreateTemplate } from './usecases/create-template/create-template.usecase';
import { DeleteTemplate } from './usecases/delete-template/delete-template.usecase';
import { GetTemplates } from './usecases/get-templates/get-templates.usecase';
import { UpdateTemplateCommand } from './usecases/update-template/update-template.command';
import { UpdateTemplate } from './usecases/update-template/update-template.usecase';
import { GetUploads } from './usecases/get-uploads/get-uploads.usecase';
import { GetUploadsCommand } from './usecases/get-uploads/get-uploads.command';

@Controller('/template')
@ApiTags('Template')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(APIKeyGuard)
export class TemplateController {
  constructor(
    private getTemplatesUsecase: GetTemplates,
    private createTemplateUsecase: CreateTemplate,
    private updateTemplateUsecase: UpdateTemplate,
    private deleteTemplateUsecase: DeleteTemplate,
    private getUploads: GetUploads
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

  @Get(':templateId/uploads')
  @ApiOperation({
    summary: 'Get all uploads information for template',
  })
  async getAllUploads(@Param('templateId', ValidateMongoId) templateId: string): Promise<UploadEntity[]> {
    return this.getUploads.execute(
      GetUploadsCommand.create({
        _templateId: templateId,
      })
    );
  }
}
