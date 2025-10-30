import { IconType } from '@types';
import { IconSizes } from 'config';

export const CloseIcon = ({ size = 'sm', color }: IconType) => {
  return (
    <svg
      color={color}
      width={IconSizes[size]}
      height={IconSizes[size]}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_6661_1573)">
        <path d="M15 5L5 15" stroke="#FF4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 5L15 15" stroke="#FF4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_6661_1573">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
