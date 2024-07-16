import { Body, Controller, Get, Param, ParseArrayPipe, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ACCESS_KEY_NAME, Defaults, ITemplateSchemaItem, UploadStatusEnum } from '@impler/shared';

import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { validateNotFound } from '@shared/helpers/common.helper';
import { validateUploadStatus } from '@shared/helpers/upload.helpers';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';

import { UpdateMappingDto } from './dtos/update-columns.dto';
import {
  DoMapping,
  GetMappings,
  FinalizeUpload,
  ReanameFileHeadings,
  DoMappingCommand,
  UpdateMappings,
  ValidateMapping,
} from './usecases';

@Controller('/mapping')
@ApiTags('Mappings')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(JwtAuthGuard)
export class MappingController {
  constructor(
    private getUpload: GetUpload,
    private doMapping: DoMapping,
    private getMappings: GetMappings,
    private finalizeUpload: FinalizeUpload,
    private updateMappings: UpdateMappings,
    private validateMapping: ValidateMapping,
    private renameFileHeadings: ReanameFileHeadings
  ) {}

  @Get(':uploadId')
  @ApiOperation({
    summary: 'Get mapping information for uploaded file',
  })
  async getMappingInformation(
    @Param('uploadId', ValidateMongoId) uploadId: string
  ): Promise<Partial<ITemplateSchemaItem>[]> {
    const uploadInformation = await this.getUpload.execute({
      uploadId,
      select: 'status headings _templateId',
    });

    // throw error if upload information not found
    validateNotFound(uploadInformation, 'upload');

    // Get mappings can be called only when file is uploaded or it's mapping in progress
    validateUploadStatus(uploadInformation.status as UploadStatusEnum, [
      UploadStatusEnum.UPLOADED,
      UploadStatusEnum.MAPPING,
    ]);

    if (uploadInformation.status === UploadStatusEnum.UPLOADED) {
      await this.doMapping.execute(
        DoMappingCommand.create({
          headings: uploadInformation.headings,
          _templateId: uploadInformation._templateId,
          _uploadId: uploadId,
        })
      );
    }

    return this.getMappings.execute(uploadId);
  }

  @Post(':uploadId/finalize')
  @ApiOperation({
    summary: 'Finalize mappings for upload',
  })
  @ApiBody({ type: [UpdateMappingDto] })
  async finalizeMappings(
    @Param('uploadId', ValidateMongoId) _uploadId: string,
    @Body(new ParseArrayPipe({ items: UpdateMappingDto, optional: true })) body: UpdateMappingDto[]
  ) {
    const uploadInformation = await this.getUpload.execute({
      uploadId: _uploadId,
      select: 'status customSchema headings',
    });

    // throw error if upload information not found
    validateNotFound(uploadInformation, 'upload');

    // Finalize mapping can only be called after the mapping has been completed
    validateUploadStatus(uploadInformation.status as UploadStatusEnum, [UploadStatusEnum.MAPPING]);

    // validate mapping data
    this.validateMapping.execute(
      body,
      _uploadId,
      JSON.parse(uploadInformation.customSchema),
      uploadInformation.headings
    );

    // save mapping
    if (Array.isArray(body) && body.length > Defaults.ZERO) {
      const templateSchema = await this.getMappings.execute(_uploadId);
      templateSchema.forEach((schemaItem: ITemplateSchemaItem, index: number) => {
        const foundColumn = body.find((item) => item.key === schemaItem.key);
        if (foundColumn) {
          templateSchema[index].columnHeading = foundColumn.columnHeading;
        }
      });
      await this.updateMappings.execute(templateSchema, _uploadId);
    }

    const { headings } = await this.renameFileHeadings.execute(_uploadId);

    // update mapping status
    return this.finalizeUpload.execute(_uploadId, headings);
  }
}
