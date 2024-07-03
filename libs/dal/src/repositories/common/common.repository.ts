import { FilterQuery, models, Types } from 'mongoose';

export class CommonRepository {
  async count<T>(name: string, query: FilterQuery<T>): Promise<number> {
    const model = models[name];
    if (model) {
      const count = await model.estimatedDocumentCount(query);

      return count;
    }

    throw new Error(`Model ${name} does not exists`);
  }

  validMongoId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  generateMongoId(inputId?: string): Types.ObjectId {
    return new Types.ObjectId(inputId);
  }
}
