import { Injectable } from '@nestjs/common';
import { UserRepository } from '@impler/dal';
import { LEAD_SIGNUP_USING } from '@shared/constants';
import { OnboardUserCommand } from './onboard-user.command';
import { LeadService } from '@shared/services/lead.service';
import { captureException } from '@shared/helpers/common.helper';
import { CreateProject, CreateProjectCommand } from 'app/project/usecases';

@Injectable()
export class OnboardUser {
  constructor(
    private leadService: LeadService,
    private createProject: CreateProject,
    private userRepository: UserRepository
  ) {}

  async execute(command: OnboardUserCommand) {
    const createdProject = await this.createProject.execute(
      CreateProjectCommand.create({
        _userId: command._userId,
        name: command.projectName,
        onboarding: true,
      })
    );

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
      try {
        await this.leadService.createLead({
          'First Name': updatedUser.firstName,
          'Last Name': updatedUser.lastName,
          'Lead Email': updatedUser.email,
          'Lead Source': updatedUser.source,
          'Mentioned Role': updatedUser.role,
          'Signup Method': updatedUser.signupMethod as LEAD_SIGNUP_USING,
          'Company Size': updatedUser.companySize,
        });
      } catch (error) {
        captureException(error);
      }
    }

    return createdProject;
  }
}
