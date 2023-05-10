import { Controller } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
@Controller('/environment')
@ApiTags('Environment')
@ApiExcludeController()
export class EnvironmentController {}
