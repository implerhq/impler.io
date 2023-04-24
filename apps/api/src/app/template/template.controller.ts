import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiSecurity } from '@nestjs/swagger';

import { UploadEntity } from '@impler/dal';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { APIKeyGuard } from '@shared/framework/auth.gaurd';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

import { TemplateResponseDto } from './dtos/template-response.dto';
import { CreateTemplateRequestDto } from './dtos/create-template-request.dto';
import { UpdateTemplateRequestDto } from './dtos/update-template-request.dto';

import {
  GetUploads,
  CreateTemplate,
  DeleteTemplate,
  UpdateTemplate,
  GetTemplateDetails,
  GetUploadsCommand,
  CreateTemplateCommand,
  UpdateTemplateCommand,
} from './usecases';

@Controller('/template')
@ApiTags('Template')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(APIKeyGuard)
export class TemplateController {
  constructor(
    private getUploads: GetUploads,
    private createTemplateUsecase: CreateTemplate,
    private updateTemplateUsecase: UpdateTemplate,
    private deleteTemplateUsecase: DeleteTemplate,
    private getTemplateDetails: GetTemplateDetails
  ) {}

  @Get(':templateId')
  @ApiOperation({
    summary: 'Get template details',
  })
  @ApiOkResponse({
    type: TemplateResponseDto,
  })
  async getTemplateDetailsRoute(
    @Param('templateId', ValidateMongoId) templateId: string
  ): Promise<TemplateResponseDto> {
    return this.getTemplateDetails.execute(templateId);
  }

  @Post('')
  @ApiOperation({
    summary: 'Create new template',
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
