import { FilterQuery, models } from 'mongoose';

export class CommonRepository {
  async count<T>(name: string, query: FilterQuery<T>): Promise<number> {
    const model = models[name];
    if (model) {
      const count = await model.count(query);

      return count;
    }

    throw new Error(`Model ${name} does not exists`);
  }
}
