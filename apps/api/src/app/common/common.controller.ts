import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { APIKeyGuard } from '../shared/framework/auth.gaurd';

@Controller('/common')
@ApiTags('Common')
@ApiSecurity('ACCESS_KEY')
@UseGuards(APIKeyGuard)
export class CommonController {
  @Get('/valid')
  @ApiOperation({
    summary: 'Check if request is valid (Checks Auth)',
  })
  isRequestValid(): boolean {
    return true;
  }
}
