import { Injectable } from '@nestjs/common';
import { EnvironmentRepository, UserRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class DeleteTeamMember {
  constructor(
    private environmentRepository: EnvironmentRepository,
    private userRepository: UserRepository
  ) {}

  async exec({ projectId, userId }: { projectId: string; userId: string }) {
    const teamMember = await this.userRepository.findById(userId, 'firstName lastName email profilePicture');
    if (!teamMember) throw new DocumentNotFoundException('TeamMember', userId);
    await this.environmentRepository.deleteTeamMember(projectId, userId);

    return teamMember;
  }
}
