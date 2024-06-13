import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { ColumnTypesEnum } from '@impler/shared';

import { CreateProjectCommand } from './create-project.command';
import { CreateEnvironment } from 'app/environment/usecases';
import { CreateTemplate, UpdateTemplateColumns } from 'app/template/usecases';

@Injectable()
export class CreateProject {
  constructor(
    private projectRepository: ProjectRepository,
    private readonly createEnvironment: CreateEnvironment,
    private readonly createTemplate: CreateTemplate,
    private readonly updateTemplateColumns: UpdateTemplateColumns
  ) {}

  async execute(command: CreateProjectCommand) {
    const project = await this.projectRepository.create(command);

    const environment = await this.createEnvironment.execute({
      projectId: project._id,
      _userId: command._userId,
    });

    if (command.onboarding) {
      await this.createSampleImport(project._id);
    }

    return {
      project,
      environment,
    };
  }

  async createSampleImport(_projectId: string) {
    const template = await this.createTemplate.execute({
      _projectId,
      chunkSize: 100,
      name: 'Sales Data Import',
    });
    await this.updateTemplateColumns.execute(
      [
        {
          _templateId: template._id,
          name: 'Date',
          key: 'Date *',
          isFrozen: true,
          type: ColumnTypesEnum.DATE,
          isRequired: true,
          dateFormats: ['DD/MM/YYYY'],
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Product Name/ID',
          key: 'Product Name/ID *',
          type: ColumnTypesEnum.STRING,
          isRequired: true,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Quantity',
          key: 'Quantity *',
          type: ColumnTypesEnum.NUMBER,
          isRequired: true,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Total Price',
          key: 'Total Price',
          type: ColumnTypesEnum.NUMBER,
          isRequired: false,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Customer Name/ID',
          key: 'Customer Name/ID *',
          type: ColumnTypesEnum.STRING,
          isRequired: true,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Payment Method',
          key: 'Payment Method *',
          type: ColumnTypesEnum.SELECT,
          selectValues: ['credit card', 'cash', 'check'],
          isRequired: true,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Transaction ID',
          key: 'Transaction ID * (unique)',
          type: ColumnTypesEnum.STRING,
          isRequired: true,
          isUnique: true,
        },
        {
          _templateId: template._id,
          name: 'Salesperson Name/ID',
          key: 'Salesperson Name/ID',
          type: ColumnTypesEnum.STRING,
          isRequired: false,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Notes/Comments',
          key: 'Notes/Comments',
          type: ColumnTypesEnum.STRING,
          isRequired: false,
          isUnique: false,
        },
      ],
      template._id
    );
  }
}
