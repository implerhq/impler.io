import { Response } from 'express';
import { ApiOperation, ApiTags, ApiOkResponse, ApiSecurity, ApiBody } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Res, UseGuards } from '@nestjs/common';

import { UploadEntity } from '@impler/dal';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { AddColumnCommand } from 'app/column/commands/add-column.command';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

import {
  GetUploads,
  GetTemplateColumns,
  CreateTemplate,
  DeleteTemplate,
  UpdateTemplate,
  SyncCustomization,
  GetTemplateDetails,
  GetUploadsCommand,
  CreateTemplateCommand,
  UpdateTemplateCommand,
  UpdateTemplateColumns,
  GetCustomization,
  UpdateCustomization,
  UpdateCustomizationCommand,
  GetValidations,
  DownloadSample,
  UpdateValidations,
  UpdateValidationsCommand,
} from './usecases';

import { TemplateResponseDto } from './dtos/template-response.dto';
import { ColumnRequestDto } from 'app/column/dtos/column-request.dto';
import { DownloadSampleDto } from './dtos/download-sample-request.dto';
import { ColumnResponseDto } from 'app/column/dtos/column-response.dto';
import { ValidationsResponseDto } from './dtos/validations-response.dto';
import { CustomizationResponseDto } from './dtos/customization-response.dto';
import { CreateTemplateRequestDto } from './dtos/create-template-request.dto';
import { UpdateTemplateRequestDto } from './dtos/update-template-request.dto';
import { UpdateValidationResponseDto } from './dtos/update-validation-response.dto';
import { UpdateValidationsRequestDto } from './dtos/update-validations-request.dto';
import { UpdateCustomizationRequestDto } from './dtos/update-customization-request.dto';

@Controller('/template')
@ApiTags('Template')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(JwtAuthGuard)
export class TemplateController {
  constructor(
    private getUploads: GetUploads,
    private getValidations: GetValidations,
    private downloadSample: DownloadSample,
    private getCustomization: GetCustomization,
    private updateValidations: UpdateValidations,
    private syncCustomization: SyncCustomization,
    private createTemplateUsecase: CreateTemplate,
    private updateTemplateUsecase: UpdateTemplate,
    private deleteTemplateUsecase: DeleteTemplate,
    private getTemplateColumns: GetTemplateColumns,
    private getTemplateDetails: GetTemplateDetails,
    private updateCustomization: UpdateCustomization,
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

  @Post(':templateId/sample')
  @ApiOperation({
    summary: 'Get Template Sample',
  })
  async downloadSampleRoute(
    @Param('templateId', ValidateMongoId) templateId: string,
    @Body() data: DownloadSampleDto,
    @Res() res: Response
  ) {
    const buffer = await this.downloadSample.execute(templateId, data);
    res.header('Content-disposition', 'attachment; filename=anlikodullendirme.xlsx');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return res.send(buffer);
  }

  @Get(':templateId/columns')
  @ApiOperation({
    summary: 'Get template columns',
  })
  @ApiOkResponse({
    type: [ColumnResponseDto],
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
          dateFormats: columnData.dateFormats,
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

  // Customization
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

  @Put(':templateId/customizations/sync')
  @ApiOperation({
    summary: 'Sync template customizations',
  })
  @ApiOkResponse({
    type: CustomizationResponseDto,
  })
  async syncCustomizationRoute(
    @Param('templateId', ValidateMongoId) templateId: string
  ): Promise<CustomizationResponseDto> {
    return this.syncCustomization.execute(templateId);
  }

  // Validations
  @Get(':templateId/validations')
  @ApiOperation({
    summary: 'Get template validations',
  })
  @ApiOkResponse({
    type: ValidationsResponseDto,
  })
  async getValidationsRoute(@Param('templateId', ValidateMongoId) templateId: string): Promise<ValidationsResponseDto> {
    return this.getValidations.execute(templateId);
  }

  @Put(':templateId/validations')
  @ApiOperation({
    summary: 'Update template validations',
  })
  @ApiOkResponse({
    type: UpdateValidationResponseDto,
  })
  async updateValidationsRoute(
    @Param('templateId', ValidateMongoId) templateId: string,
    @Body() body: UpdateValidationsRequestDto
  ): Promise<UpdateValidationResponseDto> {
    return this.updateValidations.execute(templateId, UpdateValidationsCommand.create(body));
  }
}
