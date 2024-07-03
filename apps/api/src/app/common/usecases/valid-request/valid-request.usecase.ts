import { Injectable, HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';
import { ProjectRepository, TemplateRepository } from '@impler/dal';
import { ValidRequestCommand } from './valid-request.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { APIMessages } from '@shared/constants';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { SchemaDto } from 'app/common/dtos/Schema.dto';

@Injectable()
export class ValidRequest {
  constructor(
    private projectRepository: ProjectRepository,
    private templateRepository: TemplateRepository
  ) {}

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

      if (command.schema) {
        const parsedSchema: SchemaDto[] =
          typeof command.schema === 'string' ? JSON.parse(command.schema) : command.schema;

        const errors: string[] = [];
        if (!Array.isArray(parsedSchema)) {
          throw new DocumentNotFoundException(
            'Schema',
            command.schema,
            'Invalid schema input. An array of schema object columns is expected.'
          );
        }

        for (const item of parsedSchema) {
          const columnDto = plainToClass(SchemaDto, item);
          const validationErrors = await validate(columnDto);

          // eslint-disable-next-line no-magic-numbers
          if (validationErrors.length > 0) {
            errors.push(
              `Schema Error : ${validationErrors
                .map((err) => {
                  return Object.values(err.constraints);
                })
                .join(', ')}`
            );

            throw new DocumentNotFoundException('Schema', command.schema, errors.toString());
          }
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

      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            message: APIMessages.INVALID_AUTH_TOKEN,
            errorCode: error.getStatus(),
          },
          HttpStatus.NOT_FOUND
        );
      }

      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
