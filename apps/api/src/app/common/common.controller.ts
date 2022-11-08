import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ACCESS_KEY_NAME } from '@impler/shared';
import { APIKeyGuard } from '../shared/framework/auth.gaurd';
import { ValidRequestDto } from './dtos/valid.dto';
import { ValidRequestCommand } from './usecases/valid-request/valid-request.command';
import { ValidRequest } from './usecases/valid-request/valid-request.usecase';

@Controller('/common')
@ApiTags('Common')
@ApiSecurity(ACCESS_KEY_NAME)
@UseGuards(APIKeyGuard)
export class CommonController {
  constructor(private validRequest: ValidRequest) {}

  @Post('/valid')
  @ApiOperation({
    summary: 'Check if request is valid (Checks Auth)',
  })
  async isRequestValid(@Body() body: ValidRequestDto): Promise<boolean> {
    return this.validRequest.execute(
      ValidRequestCommand.create({
        projectId: body.projectId,
        template: body.template,
      })
    );
  }
}
