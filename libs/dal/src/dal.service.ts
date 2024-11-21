import { Connection, ConnectOptions } from 'mongoose';
import * as mongoose from 'mongoose';
import { RecordEntity, RecordSchema } from './repositories/record';

export class DalService {
  connection: Connection;

  async connect(url: string, config: ConnectOptions = {}) {
    const instance = await mongoose.connect(url, config);

    this.connection = instance.connection;

    return this.connection;
  }

  isConnected(): boolean {
    return this.connection && this.connection.readyState === 1;
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async destroy() {
    if (process.env.NODE_ENV !== 'test') throw new Error('Allowed only in test mode');

    await mongoose.connection.dropDatabase();
  }

  getRecordCollection(_uploadId: string): mongoose.Model<RecordEntity> {
    let collectionModal = mongoose.models[`${_uploadId}-records`];

    if (!collectionModal) {
      collectionModal = mongoose.model(`${_uploadId}-records`, RecordSchema, `${_uploadId}-records`);
    }

    return collectionModal;
  }
  async createRecordCollection(_uploadId: string): Promise<mongoose.Model<any>> {
    return mongoose.model(`${_uploadId}-records`, RecordSchema);
  }
  async dropRecordCollection(_uploadId: string) {
    const model = this.getRecordCollection(_uploadId);
    if (!model) return;

    await model.collection.drop();
  }
  async getRecords(
    _uploadId: string,
    page: number,
    limit: number,
    type: 'all' | 'valid' | 'invalid' = 'all'
  ): Promise<RecordEntity[]> {
    const model = this.getRecordCollection(_uploadId);

    if (!model) return [];
    const conditions = type === 'all' ? {} : { isValid: type === 'valid' };

    return model
      .find(conditions, 'index isValid errors record updated')
      .skip(Math.max(0, (page - 1) * limit)) // when page is 0, it was skiping 0*n records
      .limit(limit)
      .exec();
  }
  async updateRecord(
    _uploadId: string,
    index: number,
    record: Record<string, string>,
    updated: Record<string, boolean>
  ) {
    const model = this.getRecordCollection(_uploadId);
    if (!model) return;
    if (record._id) delete record._id;

    return model.findOneAndUpdate(
      {
        index,
      },
      {
        $set: {
          index,
          record,
          updated,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }
  async updateRecords(
    _uploadId: string,
    records: {
      index: number;
      record: Record<string, string>;
      updated: Record<string, boolean>;
    }[]
  ) {
    const model = this.getRecordCollection(_uploadId);
    if (!model) return;

    const bulkOps = records.map(({ index, record, updated }) => ({
      updateOne: {
        filter: { index },
        update: {
          $set: {
            index,
            record,
            updated,
          },
        },
        upsert: true,
      },
    }));

    return model.bulkWrite(bulkOps, { ordered: false });
  }
  async deleteRecords(_uploadId: string, index: number[]) {
    const model = this.getRecordCollection(_uploadId);
    if (!model) return;

    await model.deleteMany({ index: { $in: index } });
  }
  getRecordBulkOp(_uploadId: string) {
    const model = this.getRecordCollection(_uploadId);
    if (!model) return;

    return model.collection.initializeUnorderedBulkOp();
  }
  getAllRecords(_uploadId: string) {
    const model = this.getRecordCollection(_uploadId);
    if (!model) return;

    return model.find({}, 'index isValid errors record');
  }
  getFieldData(_uploadId: string, fields: string[]) {
    const model = this.getRecordCollection(_uploadId);
    if (!model) return;

    return model.aggregate([
      {
        $match: {
          $or: [
            {
              updated: {
                $exists: false,
              },
            },
            {
              updated: {
                $eq: {},
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          record: {
            ...fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {}),
          },
        },
      },
    ]);
  }
}
