import { IconType } from '@types';
import { IconSizes } from 'config';

export const DrawerRightOpenIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M15 3v18M8 9l3 3l-3 3" />
      </g>
    </svg>
  );
};
