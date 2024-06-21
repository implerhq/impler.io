import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { UserController } from './user.controller';
import { SharedModule } from '@shared/shared.module';
import { PaymentAPIService } from '@impler/shared';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES, PaymentAPIService],
  controllers: [UserController],
})
export class UserModule {}
