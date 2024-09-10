import { model, models, Schema } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { ProjectInvitationEntity } from './project-invitation.entity';

const projectInvitationSchema = new Schema(
  {
    invitationToEmail: {
      type: Schema.Types.String,
    },
    invitedOn: {
      type: Schema.Types.String,
    },
    role: {
      type: Schema.Types.String,
    },
    invitedBy: {
      type: Schema.Types.String,
    },
    token: {
      type: Schema.Types.String,
    },
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  },
  { ...schemaOptions }
);

interface IProjectInvitation extends ProjectInvitationEntity, Document {
  _id: never;
}

export const ProjectInvitation =
  models.ProjectInvitation || model<IProjectInvitation>('ProjectInvitation', projectInvitationSchema);
