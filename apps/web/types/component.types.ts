import { IconSizes } from '@config';

export interface IconType {
  name?: string;
  size?: keyof typeof IconSizes;
}
