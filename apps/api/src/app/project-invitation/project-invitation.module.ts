import { Module } from '@nestjs/common';
import { USE_CASES } from './usecase';
import { ProjectInvitationController } from './project-invitation.controller';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [...USE_CASES],
  controllers: [ProjectInvitationController],
})
export class ProjectInvitationModule {}
