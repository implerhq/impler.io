import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OnboardUserDto {
  @ApiProperty({
    description: 'Size of the company',
  })
  @IsString()
  @IsDefined()
  companySize: string;

  @ApiProperty({
    description: 'Role of the user',
  })
  @IsString()
  @IsDefined()
  role: string;

  @ApiProperty({
    description: 'Source from where the user heard about us',
  })
  @IsString()
  @IsDefined()
  source: string;

  @ApiProperty({
    description: 'Name of the Project',
  })
  @IsString()
  @IsDefined()
  projectName: string;
}
