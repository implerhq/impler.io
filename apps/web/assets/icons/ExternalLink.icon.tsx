import { IconType } from '@types';
import { IconSizes } from 'config';

export const ExternalLinkIcon = ({ size = 'sm', color, className }: IconType) => {
  return (
    <svg
      color={color}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      className={className}
      width={IconSizes[size]}
      height={IconSizes[size]}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
};
