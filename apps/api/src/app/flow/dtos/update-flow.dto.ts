import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFlowRequestDTo {
  @ApiProperty({
    description: 'New name of the flow.',
    default: false,
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;
}
