import { IconSizes } from '@config';

export interface IconType {
  name?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: keyof typeof IconSizes;
}
