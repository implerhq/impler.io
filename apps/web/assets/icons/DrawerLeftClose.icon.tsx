import { IconType } from '@types';
import { IconSizes } from 'config';

export const DrawerLeftCloseIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg width={IconSizes[size]} height={IconSizes[size]} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18m7-6l-3-3l3-3" />
      </g>
    </svg>
  );
};
