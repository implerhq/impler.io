import { Module } from '@nestjs/common';
import { USE_CASES } from './usecase';
import { TeamController } from './team.controller';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [TeamController],
})
export class TeamModule {}
