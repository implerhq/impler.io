import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IJwtPayload } from '@impler/shared';
import { ProjectInvitationDto } from './dto/project-invtation.dto';
import {
  Invite,
  SentProjectInvitations,
  GetProjectInvitation,
  AcceptProjectInvitation,
  ListTeamMembers,
  UpdateTeamMemberRole,
  DeleteTeamMember,
} from './usecase';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { UserSession } from '@shared/framework/user.decorator';
import { UpdateTeamMemberRoleDto } from './dto/update-team-member-role.dto';

@Controller('invite')
export class ProjectInvitationController {
  constructor(
    private invite: Invite,
    private sentProjectInvitations: SentProjectInvitations,
    private getProjectInvitation: GetProjectInvitation,
    private acceptProjectInvitation: AcceptProjectInvitation,
    private listTeamMembers: ListTeamMembers,
    private updateTeamMemberRole: UpdateTeamMemberRole,
    private deleteTeamMember: DeleteTeamMember
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
    summary: 'Fetch an already sent invitation when the user tries to accept the invitation',
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

  @Get('/team-members-list')
  @ApiOperation({
    summary:
      'List out the who have accepted the project invitation and now a part of a team and working on the same project',
  })
  async listTeamMembersRoute(@UserSession() user: IJwtPayload) {
    return await this.listTeamMembers.exec(user._projectId);
  }

  @Put('/team-members-role-update')
  @ApiOperation({
    summary: 'Change the role of a particular team member',
  })
  async updateTeamMemberRoleRoute(@Body() updateTeamMemberData: UpdateTeamMemberRoleDto) {
    return this.updateTeamMemberRole.exec({
      projectId: updateTeamMemberData.projectId,
      userId: updateTeamMemberData.userId,
      role: updateTeamMemberData.role,
    });
  }

  @Delete('/team-member-delete')
  @ApiOperation({
    summary: 'Delete a team member from the environment',
  })
  async deleteTeamMemberRoute(@Query('projectId') projectId: string, @Query('userId') userId: string) {
    return await this.deleteTeamMember.exec({ projectId, userId });
  }
}
