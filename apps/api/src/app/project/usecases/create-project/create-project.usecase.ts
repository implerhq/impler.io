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

  async execute(command: CreateProjectCommand, email: string) {
    const project = await this.projectRepository.create(command);

    const environment = await this.createEnvironment.execute({
      projectId: project._id,
      _userId: command._userId,
    });

    if (command.onboarding) {
      await this.createSampleImport(project._id, email);
    }

    return {
      project,
      environment,
    };
  }

  async createSampleImport(_projectId: string, email: string) {
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
          description: 'The date when the transaction took place. Format: DD/MM/YYYY',
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
          description: 'The name or ID of the product purchased, e.g., "Apple" or "12345"',
          type: ColumnTypesEnum.STRING,
          isRequired: true,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Quantity',
          key: 'Quantity *',
          description: 'The amount of the product purchased. For example, "3" apples or "2" bottles of milk',
          type: ColumnTypesEnum.NUMBER,
          isRequired: true,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Total Price',
          key: 'Total Price',
          description: 'The total cost of the products purchased in this transaction. For example, "$10.50"',
          type: ColumnTypesEnum.NUMBER,
          isRequired: false,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Customer Name/ID',
          key: 'Customer Name/ID *',
          description: 'The name or ID of the customer making the purchase, e.g., "John Doe" or "7890"',
          type: ColumnTypesEnum.STRING,
          isRequired: true,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Payment Method',
          key: 'Payment Method *',
          description: 'The method used for payment. Options include credit card, cash, or check',
          type: ColumnTypesEnum.SELECT,
          selectValues: ['credit card', 'cash', 'check'],
          isRequired: true,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Transaction ID',
          key: 'Transaction ID * (unique)',
          description: 'A unique identifier for the transaction. For example, "TX12345678"',
          type: ColumnTypesEnum.STRING,
          isRequired: true,
          isUnique: true,
        },
        {
          _templateId: template._id,
          name: 'Salesperson Name/ID',
          key: 'Salesperson Name/ID',
          description: 'The name or ID of the salesperson handling the transaction, e.g., "Jane Smith" or "3456"',
          type: ColumnTypesEnum.STRING,
          isRequired: false,
          isUnique: false,
        },
        {
          _templateId: template._id,
          name: 'Notes/Comments',
          key: 'Notes/Comments',
          description:
            'Additional comments or notes about the transaction. For example, "Discount applied" or "Gift wrap requested"',
          type: ColumnTypesEnum.STRING,
          isRequired: false,
          isUnique: false,
        },
      ],
      template._id,
      email
    );
  }
}
