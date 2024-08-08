import { Injectable } from '@nestjs/common';
import { UserEntity, UserRepository } from '@impler/dal';
import { OnboardUserCommand } from './onboard-user.command';
import { CreateProjectCommand } from 'app/project/usecases';

@Injectable()
export class OnboardUser {
  constructor(private userRepository: UserRepository) {}

  async execute(command: OnboardUserCommand): Promise<UserEntity | null> {
    CreateProjectCommand.create({
      _userId: command._userId,
      name: command.projectName,
      onboarding: true,
    });

    await this.userRepository.update(
      { _id: command._userId },
      {
        role: command.role,
        companySize: command.companySize,
        source: command.source,
      }
    );

    const updatedUser = await this.userRepository.findOne({ _id: command._userId });

    return updatedUser;
  }
}
