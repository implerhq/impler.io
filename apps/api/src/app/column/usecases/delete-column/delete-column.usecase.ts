import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';
import { UpdateCustomization } from 'app/template/usecases';

@Injectable()
export class DeleteColumn {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private updateCustomization: UpdateCustomization
  ) {}

  async execute(_id: string) {
    const column = await this.columnRepository.findById(_id);
    if (!column) {
      throw new DocumentNotFoundException('Column', _id);
    }
    await this.columnRepository.delete({ _id });

    const columns = await this.columnRepository.find({ _templateId: column._templateId });
    await this.updateCustomization.execute(column._templateId, {
      recordVariables: columns.map((columnItem) => columnItem.key).filter((variable) => variable !== column.key),
      internal: true,
    });
    await this.saveSampleFile.execute(columns, column._templateId);

    return column;
  }
}
