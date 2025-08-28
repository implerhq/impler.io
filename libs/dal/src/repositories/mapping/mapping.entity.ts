import { Exclude } from 'class-transformer';

export class MappingEntity {
  _id?: string;

  _columnId: string;

  _uploadId: string;

  columnHeading: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  __v?: number;
}
