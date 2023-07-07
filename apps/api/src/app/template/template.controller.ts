import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiSecurity, ApiBody } from '@nestjs/swagger';

import { UploadEntity } from '@impler/dal';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { AddColumnCommand } from 'app/column/commands/add-column.command';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

import { TemplateResponseDto } from './dtos/template-response.dto';
import { CreateTemplateRequestDto } from './dtos/create-template-request.dto';
import { UpdateTemplateRequestDto } from './dtos/update-template-request.dto';

import {
  GetUploads,
  GetTemplateColumns,
  CreateTemplate,
  DeleteTemplate,
  UpdateTemplate,
  GetTemplateDetails,
  GetUploadsCommand,
  CreateTemplateCommand,
  UpdateTemplateCommand,
  UpdateTemplateColumns,
  GetCustomization,
  UpdateCustomization,
  UpdateCustomizationCommand,
} from './usecases';
import { ColumnResponseDto } from 'app/column/dtos/column-response.dto';
import { ColumnRequestDto } from 'app/column/dtos/column-request.dto';
import { CustomizationResponseDto } from './dtos/customization-response.dto';
import { UpdateCustomizationRequestDto } from './dtos/update-customization-request.dto';

@Controller('/template')
@ApiTags('Template')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(JwtAuthGuard)
export class TemplateController {
  constructor(
    private getTemplateColumns: GetTemplateColumns,
    private getUploads: GetUploads,
    private getCustomization: GetCustomization,
    private updateCustomization: UpdateCustomization,
    private createTemplateUsecase: CreateTemplate,
    private updateTemplateUsecase: UpdateTemplate,
    private deleteTemplateUsecase: DeleteTemplate,
    private getTemplateDetails: GetTemplateDetails,
    private updateTemplateColumns: UpdateTemplateColumns
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

  @Get(':templateId/columns')
  @ApiOperation({
    summary: 'Get template columns',
  })
  @ApiOkResponse({
    type: [TemplateResponseDto],
  })
  async getColumns(@Param('templateId') _templateId: string): Promise<ColumnResponseDto[]> {
    return this.getTemplateColumns.execute(_templateId);
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
        authHeaderName: body.authHeaderName,
      }),
      templateId
    );
    if (!document) {
      throw new DocumentNotFoundException('Template', templateId);
    }

    return document;
  }

  @Put(':templateId/columns')
  @ApiOperation({
    summary: 'Update columns for Template',
  })
  @ApiBody({ type: [ColumnRequestDto] })
  async updateTemplateColumnRoute(
    @Param('templateId', ValidateMongoId) _templateId: string,
    @Body(new ParseArrayPipe({ items: ColumnRequestDto, stopAtFirstError: false })) body: ColumnRequestDto[]
  ): Promise<ColumnResponseDto[]> {
    return this.updateTemplateColumns.execute(
      body.map((columnData) =>
        AddColumnCommand.create({
          key: columnData.key,
          alternateKeys: columnData.alternateKeys,
          isRequired: columnData.isRequired,
          isUnique: columnData.isUnique,
          name: columnData.name,
          regex: columnData.regex,
          regexDescription: columnData.regexDescription,
          selectValues: columnData.selectValues,
          sequence: columnData.sequence,
          _templateId,
          type: columnData.type,
        })
      ),
      _templateId
    );
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

  @Get(':templateId/customizations')
  @ApiOperation({
    summary: 'Get template customizations',
  })
  @ApiOkResponse({
    type: CustomizationResponseDto,
  })
  async getCustomizations(@Param('templateId', ValidateMongoId) templateId: string): Promise<CustomizationResponseDto> {
    return this.getCustomization.execute(templateId);
  }

  @Put(':templateId/customizations')
  @ApiOperation({
    summary: 'Update template customizations',
  })
  @ApiOkResponse({
    type: CustomizationResponseDto,
  })
  async updateCustomizationRequest(
    @Param('templateId', ValidateMongoId) templateId: string,
    @Body() body: UpdateCustomizationRequestDto
  ): Promise<CustomizationResponseDto> {
    return this.updateCustomization.execute(templateId, UpdateCustomizationCommand.create(body));
  }
}
