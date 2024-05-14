import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Payment Method Id which is created while making setup intent in Stripe',
  })
  @IsString()
  paymentMethodId: string;
}
