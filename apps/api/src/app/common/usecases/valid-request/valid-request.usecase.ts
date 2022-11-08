import { Injectable } from '@nestjs/common';
import { ProjectRepository, TemplateRepository, CommonRepository } from '@impler/dal';
import { ValidRequestCommand } from './valid-request.command';
import { DocumentNotFoundException } from '../../../shared/exceptions/document-not-found.exception';
import { APIMessages } from '../../../shared/constants';

@Injectable()
export class ValidRequest {
  constructor(
    private projectRepository: ProjectRepository,
    private templateRepository: TemplateRepository,
    private commonRepository: CommonRepository
  ) {}

  async execute(command: ValidRequestCommand) {
    if (command.template) {
      const isMongoId = this.commonRepository.validMongoId(command.template);
      const templateCount = await this.templateRepository.count(
        isMongoId
          ? { _id: command.template, _projectId: command.projectId }
          : { code: command.template, _projectId: command.projectId }
      );
      if (!templateCount) {
        throw new DocumentNotFoundException('Template', command.template, APIMessages.PROJECT_WITH_TEMPLATE_MISSING);
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
