import { Injectable } from '@nestjs/common';
import { ProjectRepository, TemplateRepository } from '@impler/dal';
import { ValidRequestCommand } from './valid-request.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { APIMessages } from '@shared/constants';

@Injectable()
export class ValidRequest {
  constructor(private projectRepository: ProjectRepository, private templateRepository: TemplateRepository) {}

  async execute(command: ValidRequestCommand) {
    if (command.templateId) {
      const templateCount = await this.templateRepository.count({
        _id: command.templateId,
        _projectId: command.projectId,
      });
      if (!templateCount) {
        throw new DocumentNotFoundException('Template', command.templateId, APIMessages.PROJECT_WITH_TEMPLATE_MISSING);
      }
    } else {
      const projectCount = await this.projectRepository.count({
        _id: command.projectId,
      });
      if (!projectCount) {
        throw new DocumentNotFoundException('Project', command.projectId);
      }
    }

    return true;
  }
}
