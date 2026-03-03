/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassConstructor, plainToClass } from 'class-transformer';
import { Document, FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';

export class BaseRepository<T> {
  public _model: Model<any & Document>;

  constructor(
    protected MongooseModel: Model<any & Document>,
    protected entity: ClassConstructor<T>
  ) {
    this._model = MongooseModel;
  }

  private sanitizeQuery(query: FilterQuery<T & Document>): FilterQuery<T & Document> {
    if (typeof query !== 'object' || Array.isArray(query)) {
      throw new Error('Invalid query format');
    }

    const sanitizedQuery: Record<string, any> = {};
    for (const key of Object.keys(query)) {
      const value = query[key];

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const hasOperators = Object.keys(value).some((subKey) => subKey.startsWith('$'));
        if (hasOperators) {
          sanitizedQuery[key] = value;
          continue;
        }
      }

      sanitizedQuery[key] = { $eq: value };
    }

    return sanitizedQuery as FilterQuery<T & Document>;
  }

  public static createObjectId() {
    return new Types.ObjectId().toString();
  }

  async count(query: FilterQuery<T & Document>): Promise<number> {
    const sanitizedQuery = this.sanitizeQuery(query);

    return await this.MongooseModel.countDocuments(sanitizedQuery);
  }

  private static readonly BLOCKED_AGGREGATE_STAGES = ['$out', '$merge'];

  async aggregate(query: any[]): Promise<any> {
    if (!Array.isArray(query)) {
      throw new Error('Aggregate pipeline must be an array');
    }
    // Validate pipeline stages to prevent data exfiltration via $out/$merge
    for (const stage of query) {
      const stageKeys = Object.keys(stage);
      for (const key of stageKeys) {
        if (BaseRepository.BLOCKED_AGGREGATE_STAGES.includes(key)) {
          throw new Error(`Aggregate stage '${key}' is not allowed`);
        }
      }
    }

    return await this.MongooseModel.aggregate(query);
  }

  async findById(id: string, select?: string): Promise<T | null> {
    try {
      const data = await this.MongooseModel.findById(id, select);
      if (!data) return null;

      return this.mapEntity(data.toObject());
    } catch (error) {
      return null;
    }
  }

  async findOne(query: FilterQuery<T & Document>, select?: string) {
    const sanitizedQuery = this.sanitizeQuery(query);
    const data = await this.MongooseModel.findOne(sanitizedQuery, select);
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  async delete(query: FilterQuery<T & Document>) {
    const sanitizedQuery = this.sanitizeQuery(query);
    const data = await this.MongooseModel.findOneAndDelete(sanitizedQuery); //just return data

    return data;
  }

  async deleteMany(query: FilterQuery<T & Document>): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const sanitizedQuery = this.sanitizeQuery(query);

    const data = await this.MongooseModel.deleteMany(sanitizedQuery);

    return data;
  }

  async find(
    query: FilterQuery<T & Document>,
    select = '',
    options: { limit?: number; sort?: any; skip?: number } = {}
  ): Promise<T[]> {
    const sanitizedQuery = this.sanitizeQuery(query);

    const data = await this.MongooseModel.find(sanitizedQuery, select, {
      sort: options.sort || null,
    })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
      .exec();

    return this.mapEntities(data);
  }

  async paginate(
    query: FilterQuery<T & Document>,
    select = '',
    options: { limit?: number; sort?: any; skip?: number } = {}
  ): Promise<{
    data: T[];
    total: number;
  } | null> {
    const sanitizedQuery = this.sanitizeQuery(query);

    const data = await this.MongooseModel.find(sanitizedQuery, select, {
      sort: options.sort || null,
    })
      .skip(options.skip)
      .limit(options.limit)
      .lean()
      .exec();

    const count = await this.count(query);
    if (!data) return null;

    return {
      data: data ? this.mapEntities(data) : [],
      total: count,
    };
  }

  async *findBatch(
    query: FilterQuery<T & Document>,
    select = '',
    options: { limit?: number; sort?: any; skip?: number } = {},
    batchSize = 500
  ) {
    const sanitizedQuery = this.sanitizeQuery(query);

    for await (const doc of this._model
      .find(sanitizedQuery, select, {
        sort: options.sort || null,
      })
      .batchSize(batchSize)
      .cursor()) {
      yield this.mapEntities(doc);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    const newEntity = new this.MongooseModel(data);
    const saved = await newEntity.save();

    return this.mapEntity(saved);
  }

  async createMany(data: T[]): Promise<T[]> {
    return await this.MongooseModel.insertMany(data);
  }

  async update(
    query: FilterQuery<T & Document>,
    updateBody: any
  ): Promise<{
    matched: number;
    modified: number;
  }> {
    const sanitizedQuery = this.sanitizeQuery(query);
    const saved = await this.MongooseModel.updateMany(sanitizedQuery, updateBody, {
      multi: true,
    });

    return {
      matched: saved.matchedCount,
      modified: saved.modifiedCount,
    };
  }

  async findOneAndUpdate(
    query: FilterQuery<T & Document>,
    updateBody: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true } // By default return updated document
  ): Promise<T> {
    const sanitizedQuery = this.sanitizeQuery(query);

    return this.MongooseModel.findOneAndUpdate(sanitizedQuery, updateBody, options);
  }

  protected mapEntity(data: any): T {
    return plainToClass<T, T>(this.entity, JSON.parse(JSON.stringify(data))) as any;
  }

  protected mapEntities(data: any): T[] {
    return plainToClass<T, T[]>(this.entity, JSON.parse(JSON.stringify(data)));
  }
}
