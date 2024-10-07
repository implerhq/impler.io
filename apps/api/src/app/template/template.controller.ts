import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiOkResponse, ApiSecurity, ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UploadEntity } from '@impler/dal';
import { ACCESS_KEY_NAME, IJwtPayload, IntegrationEnum } from '@impler/shared';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

import {
  GetUploads,
  DuplicateTemplate,
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
  GetValidations,
  DownloadSample,
  GetDestination,
  UpdateValidations,
  UpdateDestination,
  MapBubbleIoColumns,
  UpdateDestinationCommand,
  DuplicateTemplateCommand,
  UpdateValidationsCommand,
} from './usecases';

import { TemplateResponseDto } from './dtos/template-response.dto';
import { ColumnRequestDto } from 'app/column/dtos/column-request.dto';
import { DownloadSampleDto } from './dtos/download-sample-request.dto';
import { ColumnResponseDto } from 'app/column/dtos/column-response.dto';
import { ValidationsResponseDto } from './dtos/validations-response.dto';
import { DestinationResponseDto } from './dtos/destination-response.dto';
import { UpdateDestinationDto } from './dtos/update-destination-request.dto';
import { CustomizationResponseDto } from './dtos/customization-response.dto';
import { CreateTemplateRequestDto } from './dtos/create-template-request.dto';
import { UpdateTemplateRequestDto } from './dtos/update-template-request.dto';
import { DuplicateTemplateRequestDto } from './dtos/duplicate-template-request.dto';
import { UpdateValidationResponseDto } from './dtos/update-validation-response.dto';
import { UpdateValidationsRequestDto } from './dtos/update-validations-request.dto';
import { UpdateCustomizationRequestDto } from './dtos/update-customization-request.dto';
import { UserSession } from '@shared/framework/user.decorator';

@Controller('/template')
@ApiTags('Template')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(JwtAuthGuard)
export class TemplateController {
  constructor(
    private getUploads: GetUploads,
    private getValidations: GetValidations,
    private downloadSample: DownloadSample,
    private getDestination: GetDestination,
    private getCustomization: GetCustomization,
    private updateDestination: UpdateDestination,
    private updateValidations: UpdateValidations,
    private syncCustomization: SyncCustomization,
    private duplicateTemplate: DuplicateTemplate,
    private createTemplateUsecase: CreateTemplate,
    private updateTemplateUsecase: UpdateTemplate,
    private deleteTemplateUsecase: DeleteTemplate,
    private getTemplateColumns: GetTemplateColumns,
    private getTemplateDetails: GetTemplateDetails,
    private mapBubbleIoColumns: MapBubbleIoColumns,
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async downloadSampleRoute(
    @Param('templateId', ValidateMongoId) _templateId: string,
    @Body() data: DownloadSampleDto,
    @Res() res: Response,
    @UploadedFile('file') images: Express.Multer.File
  ) {
    const { ext, file, type } = await this.downloadSample.execute({
      data,
      images,
      _templateId,
    });
    res.header(`Content-disposition', 'attachment; filename=sample.${ext}`);
    res.type(type);

    return res.send(file);
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

  @Post()
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
        integration: body.integration as IntegrationEnum,
      })
    );
  }

  @Post(':templateId/duplicate')
  @ApiOperation({
    summary: 'Duplicate template',
  })
  @ApiOkResponse({
    type: TemplateResponseDto,
  })
  async duplicateTemplateRoute(
    @Param('templateId', ValidateMongoId) templateId: string,
    @Body() body: DuplicateTemplateRequestDto
  ): Promise<TemplateResponseDto> {
    return this.duplicateTemplate.execute(templateId, DuplicateTemplateCommand.create(body));
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
        name: body.name,
        mode: body.mode,
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
    @UserSession() user: IJwtPayload,
    @Param('templateId', ValidateMongoId) _templateId: string,
    @Body(new ParseArrayPipe({ items: ColumnRequestDto, stopAtFirstError: false })) body: ColumnRequestDto[]
  ): Promise<ColumnResponseDto[]> {
    return this.updateTemplateColumns.execute(
      body.map((columnData) => ({
        _templateId,
        ...columnData,
      })),
      _templateId,
      user.email
    );
  }

  @Put(':templateId/map-bubble-io-columns')
  @ApiOperation({
    summary: 'Update columns for Template from BubbleIo',
  })
  async mapBubbleIoColumnsRoute(
    @Param('templateId', ValidateMongoId) templateId: string,
    @Body() body: UpdateDestinationDto
  ): Promise<DestinationResponseDto> {
    return this.mapBubbleIoColumns.execute(templateId, UpdateDestinationCommand.create(body));
  }

  @Get(':templateId/destination')
  @ApiOperation({
    summary: 'Get template destination',
  })
  @ApiOkResponse({
    type: DestinationResponseDto,
  })
  async getTemplateDestinationRoute(
    @Param('templateId', ValidateMongoId) templateId: string
  ): Promise<DestinationResponseDto> {
    return this.getDestination.execute(templateId);
  }

  @Put(':templateId/destination')
  @ApiOperation({
    summary: 'Update template destination',
  })
  @ApiOkResponse({
    type: DestinationResponseDto,
  })
  async updateTemplateDestinationRoute(
    @Param('templateId', ValidateMongoId) templateId: string,
    @Body() body: UpdateDestinationDto
  ): Promise<DestinationResponseDto> {
    return this.updateDestination.execute(templateId, UpdateDestinationCommand.create(body));
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
  ) {
    return this.updateCustomization.execute(templateId, body);
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
