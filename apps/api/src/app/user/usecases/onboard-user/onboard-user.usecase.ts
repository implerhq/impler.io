import { Injectable } from '@nestjs/common';
import { UserEntity, UserRepository } from '@impler/dal';
import { OnboardUserCommand } from './onboard-user.command';
import { CreateProjectCommand } from 'app/project/usecases';
import { LeadService } from '@shared/services/lead.service';
import { LEAD_SIGNUP_USING } from '@shared/constants';

@Injectable()
export class OnboardUser {
  constructor(
    private userRepository: UserRepository,
    private leadService: LeadService
  ) {}

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
    if (updatedUser) {
      await this.leadService.createLead({
        'First Name': updatedUser.firstName,
        'Last Name': updatedUser.lastName,
        'Lead Email': updatedUser.email,
        'Lead Source': updatedUser.source,
        'Mentioned Role': updatedUser.role,
        'Signup Method': updatedUser.signupMethod as LEAD_SIGNUP_USING,
        'Company Size': updatedUser.companySize,
      });
    }

    return updatedUser;
  }
}
