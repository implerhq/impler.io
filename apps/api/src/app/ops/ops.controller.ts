// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import _whatever from 'multer';
import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiSecurity, ApiConsumes } from '@nestjs/swagger';
import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { UploadRequestDto } from './dtos/upload-request.dto';
import { ValidImportFile } from '../shared/validations/valid-import-file.validation';
import { MakeUploadEntry } from './usecases/make-upload-entry/make-upload-entry.usecase';
import { MakeUploadEntryCommand } from './usecases/make-upload-entry/make-upload-entry.command';

@Controller('/ops')
@ApiTags('Operations')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class OpsController {
  constructor(private makeUploadEntry: MakeUploadEntry) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile('file', ValidImportFile) file: Express.Multer.File, @Body() body: UploadRequestDto) {
    return await this.makeUploadEntry.execute(
      MakeUploadEntryCommand.create({
        file: file,
        templateId: body.template,
        extra: body.extra,
        authHeaderValue: body.authHeaderValue,
      })
    );

    /*
     * validate template (done)
     * upload file (done)
     * make entry to file (done)
     * make entry to uploads (done)
     * Get headings
     * do mapping
     */
  }
}
