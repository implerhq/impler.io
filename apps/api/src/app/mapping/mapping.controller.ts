import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { UploadStatusEnum } from '@impler/shared';
import { MappingEntity } from '@impler/dal';

import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { ValidateMongoId } from '../shared/validations/valid-mongo-id.validation';
import { GetUploadCommand } from './../upload/usecases/get-upload/get-upload.command';
import { DoMapping } from './usecases/do-mapping/do-mapping.usecase';
import { DoMappingCommand } from './usecases/do-mapping/do-mapping.command';
import { GetUpload } from './../upload/usecases/get-upload/get-upload.usecase';
import { GetMappings } from './usecases/get-mappings/get-mappings.usecase';

@Controller('/mapping')
@ApiTags('Mappings')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class MappingController {
  constructor(private getUpload: GetUpload, private doMapping: DoMapping, private getMappings: GetMappings) {}

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
}
