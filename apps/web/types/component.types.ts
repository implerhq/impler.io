import { IconSizes } from '@config';

export interface IconType {
  name?: string;
  color?: string;
  className?: string;
  size?: keyof typeof IconSizes;
}
