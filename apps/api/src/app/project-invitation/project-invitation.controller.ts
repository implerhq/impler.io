import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IJwtPayload } from '@impler/shared';
import { ProjectInvitationDto } from './dto/project-invtation.dto';
import { Invite, SentProjectInvitations, GetProjectInvitation, AcceptProjectInvitation } from './usecase';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { UserSession } from '@shared/framework/user.decorator';

@Controller('invite')
export class ProjectInvitationController {
  constructor(
    private invite: Invite,
    private sentProjectInvitations: SentProjectInvitations,
    private getProjectInvitation: GetProjectInvitation,
    private acceptProjectInvitation: AcceptProjectInvitation
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Invite Other Team Members to the Project',
  })
  @UseGuards(JwtAuthGuard)
  async projectInvitationRoute(@UserSession() user: IJwtPayload, @Body() projectInvitationDto: ProjectInvitationDto) {
    return await this.invite.exec({
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
    summary: 'Fetch an already sent invitation when the uer tries to accept the invitation',
  })
  async getProjectInvitationRoute(@Query('invitationId') invitationId: string, @Query('token') token: string) {
    return this.getProjectInvitation.exec({
      invitationId,
      token,
    });
  }

  @Post('/invitation-accept')
  @ApiOperation({
    summary: 'Accept a sent Invitation',
  })
  async acceptInvitationRoute(
    @UserSession() user: IJwtPayload,
    @Query('invitationId') invitationId: string,
    @Query('token') token: string
  ) {
    return await this.acceptProjectInvitation.exec({ invitationId, token, userId: user._id });
  }
}
