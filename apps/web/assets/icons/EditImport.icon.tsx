import React from 'react';
import { IconType } from '@types';
import { IconSizes } from 'config';

export const EditImportIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4.66797 4.66797H4.0013C3.64768 4.66797 3.30854 4.80844 3.05849 5.05849C2.80844 5.30854 2.66797 5.64768 2.66797 6.0013V12.0013C2.66797 12.3549 2.80844 12.6941 3.05849 12.9441C3.30854 13.1942 3.64768 13.3346 4.0013 13.3346H10.0013C10.3549 13.3346 10.6941 13.1942 10.9441 12.9441C11.1942 12.6941 11.3346 12.3549 11.3346 12.0013V11.3346"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.59 4.39007C13.8526 4.12751 14.0001 3.77139 14.0001 3.40007C14.0001 3.02875 13.8526 2.67264 13.59 2.41007C13.3274 2.14751 12.9713 2 12.6 2C12.2287 2 11.8726 2.14751 11.61 2.41007L6 8.00007V10.0001H8L13.59 4.39007Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.668 3.33203L12.668 5.33203"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <clipPath id="clip0_5236_6029">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
