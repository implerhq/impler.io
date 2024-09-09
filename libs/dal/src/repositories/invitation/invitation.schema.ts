import { model, models, Schema } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { InvitationEntity } from './invitation.entity';

const invitationSchema = new Schema(
  {
    email: {
      type: Schema.Types.String,
    },
    invitedOn: {
      type: Schema.Types.String,
    },
    role: {
      type: Schema.Types.Boolean,
    },
    invitedBy: {
      type: Schema.Types.String,
    },
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  },
  { ...schemaOptions }
);

interface IInvitation extends InvitationEntity, Document {
  _id: never;
}

export const Invitation = models.Invitation || model<IInvitation>('Invitation', invitationSchema);
