import { Injectable } from '@nestjs/common';

import { APIMessages } from '@shared/constants';
import { PaymentAPIService } from '@impler/services';
import { UpdateImageColumns, SaveSampleFile } from '@shared/usecases';
import { BILLABLEMETRIC_CODE_ENUM, ColumnTypesEnum } from '@impler/shared';
import { ColumnEntity, ColumnRepository, CustomizationRepository, TemplateRepository } from '@impler/dal';
import { AddColumnCommand } from 'app/column/commands/add-column.command';
import { UniqueColumnException } from '@shared/exceptions/unique-column.exception';
import { UpdateCustomization } from '../update-customization/update-customization.usecase';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UpdateTemplateColumns {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private paymentAPIService: PaymentAPIService,
    private templateRepository: TemplateRepository,
    private updateImageTemplates: UpdateImageColumns,
    private updateCustomization: UpdateCustomization,
    private customizationRepository: CustomizationRepository
  ) {}

  async execute(userColumns: AddColumnCommand[], _templateId: string, email: string) {
    await this.checkSchema(userColumns, email);

    // eslint-disable-next-line prefer-const
    let userInitialColumns: ColumnEntity[] = await this.columnRepository.find({ _templateId });
    await this.columnRepository.deleteMany({ _templateId });
    userColumns.forEach((column, index) => {
      const existingUserColumns = userInitialColumns.find((col: ColumnEntity) => col.key === column.key);

      column.sequence = index;
      column.dateFormats = column.dateFormats?.map((format) => format.toUpperCase()) || [];
      column.isRequired = existingUserColumns?.isRequired || column.isRequired || false;
      column.isUnique = existingUserColumns?.isUnique || column.isUnique || false;
      column.selectValues = column.selectValues || existingUserColumns?.selectValues || [];
      column.dateFormats = existingUserColumns?.dateFormats || column.dateFormats || [];
      column.validations = existingUserColumns?.validations || column.validations || [];
    });
    const columns = await this.columnRepository.createMany(userColumns);
    await this.saveSampleFile.execute(columns, _templateId);
    await this.updateImageTemplates.execute(columns, _templateId);

    const template = await this.templateRepository.findById(_templateId, 'destination');
    const customization = await this.customizationRepository.findOne(
      { _templateId },
      'isRecordFormatUpdated isCombinedFormatUpdated'
    );
    if (customization && !customization.isRecordFormatUpdated && !customization.isCombinedFormatUpdated) {
      await this.updateCustomization.createOrReset(_templateId, {
        recordVariables: this.listRecordVariables(userColumns),
        destination: template.destination,
      });
    }

    return columns;
  }

  listRecordVariables(data: AddColumnCommand[]): string[] {
    return data.map((column) => column.key);
  }

  async checkSchema(userColumns: AddColumnCommand[], email: string) {
    const columnKeysSet = new Set(userColumns.map((column) => column.key));
    if (columnKeysSet.size !== userColumns.length) {
      throw new UniqueColumnException(APIMessages.COLUMN_KEY_TAKEN);
    }

    const hasImageColumns = userColumns.some((column) => column.type === ColumnTypesEnum.IMAGE);
    const hasValidations = userColumns.some(
      (column) => Array.isArray(column.validations) && column.validations.length > 0
    );

    if (hasImageColumns && email) {
      const imageImportAvailable = await this.paymentAPIService.checkEvent({
        email,
        billableMetricCode: BILLABLEMETRIC_CODE_ENUM.IMAGE_IMPORT,
      });

      if (!imageImportAvailable) {
        throw new DocumentNotFoundException(
          'Schema',
          BILLABLEMETRIC_CODE_ENUM.IMAGE_IMPORT,
          APIMessages.FEATURE_UNAVAILABLE.IMAGE_IMPORT
        );
      }
    }
    if (hasValidations && email) {
      const validationsAvailable = await this.paymentAPIService.checkEvent({
        email,
        billableMetricCode: BILLABLEMETRIC_CODE_ENUM.ADVANCED_VALIDATORS,
      });

      if (!validationsAvailable) {
        throw new DocumentNotFoundException(
          'Schema',
          BILLABLEMETRIC_CODE_ENUM.ADVANCED_VALIDATORS,
          APIMessages.FEATURE_UNAVAILABLE.ADVANCED_VALIDATIONS
        );
      }
    }
  }
}
