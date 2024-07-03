import { Schema } from 'mongoose';

const RecordSchema = new Schema({
  index: Number,
  isValid: Boolean,
  errors: Schema.Types.Mixed,
  record: Schema.Types.Mixed,
  updated: Schema.Types.Mixed,
});

export { RecordSchema };
