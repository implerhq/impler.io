import { IconType } from '@types';
import { IconSizes } from 'config';
import React from 'react';

export const MenuOption = ({ size = 'sm', color }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={IconSizes[size]}
      height={IconSizes[size]}
      color={color}
    >
      <path d="M3 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 2a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 14a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0-5a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  );
};
