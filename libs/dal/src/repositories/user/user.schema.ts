import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UserEntity } from './user.entity';

const userSchema = new Schema(
  {
    firstName: Schema.Types.String,
    lastName: Schema.Types.String,
    email: Schema.Types.String,
    password: String,
    profilePicture: Schema.Types.String,
    showOnBoarding: Schema.Types.Boolean,
    signupMethod: Schema.Types.String,
    tokens: [
      {
        providerId: Schema.Types.String,
        provider: Schema.Types.String,
        accessToken: Schema.Types.String,
      },
    ],
    resetTokenCount: {
      reqInMinute: Schema.Types.Number,
      reqInDay: Schema.Types.Number,
    },
    resetToken: Schema.Types.String,
    resetTokenDate: Schema.Types.Date,
    companySize: Schema.Types.String,
    role: Schema.Types.String,
    source: Schema.Types.String,
  },
  schemaOptions
);

export interface IUserDocument extends UserEntity, Document {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);
