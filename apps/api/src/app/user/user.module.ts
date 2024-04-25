import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { UserController } from './user.controller';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [UserController],
})
export class UserModule {}
