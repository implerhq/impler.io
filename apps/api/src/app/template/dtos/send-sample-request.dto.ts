import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, IsArray } from 'class-validator';

export class SendSampleRequestDto {
  @ApiProperty({
    description: 'Sample data rows to be processed',
    example: [
      {
        'Product Name': 'iPhone 14',
        Quantity: 10,
        Price: 999.99,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  rows?: Record<string, any>[];

  @ApiProperty({
    description: 'Additional metadata for the sample request',
    example: {
      source: 'manual_test',
      timestamp: '2024-01-01T00:00:00Z',
    },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Optional description for the sample request',
    example: 'Testing product import functionality',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
