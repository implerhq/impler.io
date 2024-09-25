import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';

import { IJwtPayload } from '@impler/shared';
import {
  Invite,
  SentInvitations,
  GetInvitation,
  AcceptInvitation,
  ListTeamMembers,
  UpdateTeamMember,
  DeleteTeamMember,
  DeleteInvitation,
  DeclineInvitation,
} from './usecase';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { CONSTANTS, COOKIE_CONFIG } from '@shared/constants';
import { UserSession } from '@shared/framework/user.decorator';
import { InvitationDto } from './dto/invtation.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Controller('team')
export class TeamController {
  constructor(
    private invite: Invite,
    private sentInvitations: SentInvitations,
    private getInvitation: GetInvitation,
    private acceptInvitation: AcceptInvitation,
    private listTeamMembers: ListTeamMembers,
    private updateTeamMember: UpdateTeamMember,
    private deleteTeamMember: DeleteTeamMember,
    private deleteInvitation: DeleteInvitation,
    private declineInvitation: DeclineInvitation
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Invite Other Team Members to the Project',
  })
  @UseGuards(JwtAuthGuard)
  async projectInvitationRoute(@UserSession() user: IJwtPayload, @Body() invitationDto: InvitationDto) {
    return await this.invite.exec({
      invitatedBy: user.email,
      projectName: invitationDto.projectName,
      invitationEmailsTo: invitationDto.invitationEmailsTo,
      role: invitationDto.role,
      userName: user.firstName,
      projectId: invitationDto.projectId,
    });
  }

  @Get('/sent-invitations')
  @ApiOperation({
    summary: 'Fetch Team members details who have got the invitation',
  })
  @UseGuards(JwtAuthGuard)
  async sentProjectInvitationRoute(@UserSession() user: IJwtPayload) {
    return this.sentInvitations.exec({
      email: user.email,
      projectId: user._projectId,
    });
  }

  @Get('/members')
  @ApiOperation({
    summary:
      'List out the members who have accepted the project invitation and now a part of a team and working on the same project',
  })
  async listTeamMembersRoute(@UserSession() user: IJwtPayload) {
    return await this.listTeamMembers.exec(user._projectId);
  }

  @Get('/:invitationId')
  @ApiOperation({
    summary: 'Fetch an already sent invitation when the user tries to accept the invitation',
  })
  async getProjectInvitationRoute(@Param('invitationId') invitationId: string) {
    return this.getInvitation.exec(invitationId);
  }

  @Post('/:invitationId/accept')
  @ApiOperation({
    summary: 'Accept a sent Invitation',
  })
  async acceptInvitationRoute(
    @UserSession() user: IJwtPayload,
    @Query('invitationId') invitationId: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const { accessToken, screen } = await this.acceptInvitation.exec({ invitationId, user });
    response.cookie(CONSTANTS.AUTH_COOKIE_NAME, accessToken, {
      ...COOKIE_CONFIG,
      domain: process.env.COOKIE_DOMAIN,
    });

    return { screen };
  }

  @Put('/members-role-update')
  @ApiOperation({
    summary: 'Change the role of a particular team member',
  })
  async updateTeamMemberRoleRoute(@Body() updateTeamMemberData: UpdateTeamMemberDto) {
    return this.updateTeamMember.exec({
      projectId: updateTeamMemberData.projectId,
      userId: updateTeamMemberData.userId,
      role: updateTeamMemberData.role,
    });
  }

  @Delete('/member-delete')
  @ApiOperation({
    summary: 'Delete a team member from the environment',
  })
  async deleteTeamMemberRoute(@Query('projectId') projectId: string, @UserSession() user: IJwtPayload) {
    return await this.deleteTeamMember.exec({ projectId, userId: user._id });
  }

  @Delete('/:invitationId')
  @ApiOperation({
    summary: 'Cancel an already sent invitation',
  })
  async cancelInvitationRoute(@Param('invitationId') invitationId: string) {
    return await this.deleteInvitation.exec(invitationId);
  }

  @Delete('/:invitationId/decline')
  @ApiOperation({
    summary: 'Decline an Invitation',
  })
  async declineInvitationRoute(@Param('invitationId') invitationId: string, @UserSession() user: IJwtPayload) {
    return this.declineInvitation.exec({
      invitationId,
      user,
    });
  }
}
