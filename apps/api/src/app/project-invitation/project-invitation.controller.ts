import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IJwtPayload } from '@impler/shared';
import { ProjectInvitationDto } from './dto/project-invtation.dto';
import { ProjectInvitation, SentProjectInvitations, GetInvitation } from './usecase';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { UserSession } from '@shared/framework/user.decorator';

@Controller('invite')
export class ProjectInvitationController {
  constructor(
    private projectInvitation: ProjectInvitation,
    private sentProjectInvitations: SentProjectInvitations,
    private acceptProjectInvitation: GetInvitation
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Invite Other Team Members to the Project',
  })
  @UseGuards(JwtAuthGuard)
  async projectInvitationRoute(@UserSession() user: IJwtPayload, @Body() projectInvitationDto: ProjectInvitationDto) {
    return await this.projectInvitation.exec({
      invitatedBy: user.email,
      projectName: projectInvitationDto.projectName,
      invitationEmailsTo: projectInvitationDto.invitationEmailsTo,
      role: projectInvitationDto.role,
      userName: user.firstName,
      projectId: projectInvitationDto.projectId,
    });
  }

  @Get('/sent-invitation')
  @ApiOperation({
    summary: 'Fetch Team members details who have sent the invitation(s)',
  })
  @UseGuards(JwtAuthGuard)
  async sentProjectInvitationRoute(@UserSession() user: IJwtPayload) {
    const sentInviatation = await this.sentProjectInvitations.exec({
      email: user.email,
      projectId: user._projectId,
    });

    return sentInviatation;
  }

  @Get('/invitation')
  @ApiOperation({
    summary: 'Accept an invitation and delete the entry of invitation from database',
  })
  async acceptProjectInvitationRoute(@Query('invitationId') invitationId: string, @Query('token') token: string) {
    console.log(invitationId, token);

    return await this.acceptProjectInvitation.exec({
      token,
      invitationId,
    });
  }
}
