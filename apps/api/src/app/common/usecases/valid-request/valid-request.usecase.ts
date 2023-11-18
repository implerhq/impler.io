import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ProjectRepository, TemplateRepository } from '@impler/dal';
import { ValidRequestCommand } from './valid-request.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { APIMessages } from '@shared/constants';

@Injectable()
export class ValidRequest {
  constructor(private projectRepository: ProjectRepository, private templateRepository: TemplateRepository) {}

  async execute(command: ValidRequestCommand): Promise<{ success: boolean }> {
    try {
      if (command.projectId) {
        const projectCount = await this.projectRepository.count({
          _id: command.projectId,
        });

        if (!projectCount) {
          throw new DocumentNotFoundException('Project', command.projectId, APIMessages.INCORRECT_KEYS_FOUND);
        }
      }

      if (command.templateId) {
        const templateCount = await this.templateRepository.count({
          _id: command.templateId,
          _projectId: command.projectId,
        });

        if (!templateCount) {
          throw new DocumentNotFoundException('Template', command.templateId, APIMessages.INCORRECT_KEYS_FOUND);
        }
      }

      return { success: true };
    } catch (error) {
      if (error instanceof DocumentNotFoundException) {
        throw new HttpException(
          {
            message: error.message,
            errorCode: error.getStatus(),
          },
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
