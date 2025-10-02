import { Exclude } from 'class-transformer';

export class ProjectEntity {
  _id?: string;

  name: string;

  _userId: string;

  showBranding: boolean;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  __v?: number;
}
