import React from 'react';
import { IconType } from '@types';
import { IconSizes } from 'config';

export const SwapIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_5106_4813)">
        <path d="M16 3L20 7L16 11" stroke="#5463FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 7H20" stroke="#5463FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 13L4 17L8 21" stroke="#5463FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 17H13" stroke="#5463FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_5106_4813">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
