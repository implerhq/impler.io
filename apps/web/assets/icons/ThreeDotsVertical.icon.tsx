import { IconType } from '@types';
import { IconSizes } from 'config';

export const ThreeDotsVerticalIcon = ({ size = 'sm', color, className }: IconType) => {
  return (
    <svg
      color={color}
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
      width={IconSizes[size]}
      height={IconSizes[size]}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
};
