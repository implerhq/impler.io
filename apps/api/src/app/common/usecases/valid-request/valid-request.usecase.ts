import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Injectable, HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';

import { APIMessages } from '@shared/constants';
import { SchemaDto } from 'app/common/dtos/Schema.dto';
import { PaymentAPIService } from '@impler/services';
import { ValidRequestCommand } from './valid-request.command';
import { ProjectRepository, TemplateRepository, UserEntity } from '@impler/dal';
import { UniqueColumnException } from '@shared/exceptions/unique-column.exception';
import { AVAILABLE_BILLABLEMETRIC_CODE_ENUM, ColumnTypesEnum } from '@impler/shared';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class ValidRequest {
  constructor(
    private projectRepository: ProjectRepository,
    private templateRepository: TemplateRepository,
    private paymentAPIService: PaymentAPIService
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

        const columnKeys = parsedSchema.map((column) => column.key);
        const columnKeysSet = new Set(columnKeys);
        const duplicateKeys = columnKeys.filter((key, index) => columnKeys.indexOf(key) !== index);

        if (columnKeysSet.size !== parsedSchema.length) {
          throw new UniqueColumnException(
            `${APIMessages.COLUMN_KEY_DUPLICATED} Duplicate Keys Found for  ${duplicateKeys.join(', ')}`
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

        const hasImageColumns = parsedSchema.some((column) => column.type === ColumnTypesEnum.IMAGE);
        const hasValidations = parsedSchema.some(
          (column) => Array.isArray(column.validations) && column.validations.length > 0
        );
        let email: string;
        if (hasImageColumns || hasValidations) {
          const project = await this.projectRepository.getUserOfProject(command.projectId);
          email = (project._userId as unknown as UserEntity).email;
        }
        if (hasImageColumns && email) {
          const imageImportAvailable = await this.paymentAPIService.checkEvent({
            email,
            billableMetricCode: AVAILABLE_BILLABLEMETRIC_CODE_ENUM.IMAGE_IMPORT,
          });

          if (!imageImportAvailable) {
            throw new DocumentNotFoundException('Schema', command.schema, APIMessages.FEATURE_UNAVAILABLE.IMAGE_IMPORT);
          }
        }
        if (hasValidations && email) {
          const validationsAvailable = await this.paymentAPIService.checkEvent({
            email,
            billableMetricCode: AVAILABLE_BILLABLEMETRIC_CODE_ENUM.ADVANCED_VALIDATORS,
          });

          if (!validationsAvailable) {
            throw new DocumentNotFoundException(
              'Schema',
              command.schema,
              APIMessages.FEATURE_UNAVAILABLE.ADVANCED_VALIDATIONS
            );
          }
        }
      }

      return { success: true };
    } catch (error) {
      if (error instanceof UniqueColumnException) {
        throw new HttpException(
          {
            message: error.message,
            errorCode: error.getStatus(),
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

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
