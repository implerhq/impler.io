import { ApiProperty } from '@nestjs/swagger';

export class SendSampleResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the sample request',
    example: '507f1f77bcf86cd799439011',
  })
  requestId: string;

  @ApiProperty({
    description: 'Status of the sample request processing',
    example: 'success',
  })
  status: 'success' | 'processing' | 'failed';

  @ApiProperty({
    description: 'Number of rows processed',
    example: 10,
  })
  processedRows: number;

  @ApiProperty({
    description: 'Processing timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Additional processing details',
    required: false,
  })
  details?: Record<string, any>;
}
