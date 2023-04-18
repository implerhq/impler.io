import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@Controller('/environment')
@ApiTags('Environment')
export class EnvironmentController {}
