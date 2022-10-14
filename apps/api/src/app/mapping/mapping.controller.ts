import { Body, Controller, Get, Param, ParseArrayPipe, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UploadStatusEnum } from '@impler/shared';
import { MappingEntity } from '@impler/dal';

import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { ValidateMongoId } from '../shared/validations/valid-mongo-id.validation';
import { GetUploadCommand } from './../upload/usecases/get-upload/get-upload.command';
import { DoMapping } from './usecases/do-mapping/do-mapping.usecase';
import { DoMappingCommand } from './usecases/do-mapping/do-mapping.command';
import { GetUpload } from './../upload/usecases/get-upload/get-upload.usecase';
import { GetMappings } from './usecases/get-mappings/get-mappings.usecase';
import { UpdateMappingCommand } from './usecases/update-mappings/update-mappings.command';
import { UpdateMappings } from './usecases/update-mappings/update-mappings.usecase';
import { FinalizeUpload } from './usecases/finalize-upload/finalize-upload.usecase';
import { UpdateMappingDto } from './dtos/update-columns.dto';
import { ValidateMapping } from './usecases/validate-mapping/validate-mapping.usecase';

@Controller('/mapping')
@ApiTags('Mappings')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class MappingController {
  constructor(
    private getUpload: GetUpload,
    private doMapping: DoMapping,
    private getMappings: GetMappings,
    private updateMappings: UpdateMappings,
    private finalizeUpload: FinalizeUpload,
    private validateMapping: ValidateMapping
  ) {}

  @Get(':uploadId')
  @ApiOperation({
    summary: 'Get mapping information for uploaded file',
  })
  async getMappingInformation(@Param('uploadId', ValidateMongoId) uploadId: string): Promise<Partial<MappingEntity>[]> {
    const uploadInformation = await this.getUpload.execute(
      GetUploadCommand.create({
        uploadId,
        select: 'status headings _templateId',
      })
    );

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
    // validate mapping data
    await this.validateMapping.execute(body, _uploadId);

    // save mapping
    if (Array.isArray(body) && body.length > 0) {
      this.updateMappings.execute(
        body.map((updateColumnData) =>
          UpdateMappingCommand.create({
            _columnId: updateColumnData._columnId,
            _uploadId,
            columnHeading: updateColumnData.columnHeading,
          })
        ),
        _uploadId
      );
    }

    // update mapping status
    return this.finalizeUpload.execute(_uploadId);
  }
}
