import { IconSizes } from '@config';

export interface IconType {
  name?: string;
  color?: string;
  size?: keyof typeof IconSizes;
}
