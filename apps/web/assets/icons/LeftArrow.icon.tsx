import { IconType } from '@types';
import { IconSizes } from 'config';

export const LeftArrowIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg width={IconSizes[size]} height={IconSizes[size]} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <g clipPath="url(#clip0_4907_2321)">
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12L9 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12L9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_4907_2321">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};
