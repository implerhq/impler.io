import { IconType } from '@types';
import { IconSizes } from 'config';

export const IntegrationIcon = ({ size = 'lg' }: IconType) => {
  return (
    <svg
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={IconSizes[size]}
      height={IconSizes[size]}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4865_3178)">
        <path
          d="M5.83333 7.16602L2.5 10.4993L5.83333 13.8327"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.168 7.16602L17.5013 10.4993L14.168 13.8327"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6654 3.83398L8.33203 17.1673"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4865_3178">
          <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};
