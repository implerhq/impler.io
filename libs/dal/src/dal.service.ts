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

  async createRecordCollection(_uploadId: string): Promise<mongoose.Model<any>> {
    return mongoose.model(`${_uploadId}-records`, RecordSchema);
  }
  async getRecords(_uploadId: string, page: number, limit: number): Promise<RecordEntity[]> {
    const model = mongoose.models[`${_uploadId}-records`];

    if (!model) return [];

    return model
      .find({}, 'index isValid errors record updated')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }
  async updateRecord(_uploadId: string, index: number, record: RecordEntity) {
    const model = mongoose.models[`${_uploadId}-records`];
    if (!model) return;
    if (record._id) delete record._id;

    await model.updateOne(
      {
        index,
      },
      record
    );
  }
}
