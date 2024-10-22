import { IconSizes } from '@config';
import { IconType } from '@types';

export const BackArrowIcon = ({ size = 'lg' }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clip-path="url(#clip0_4907_2321)">
        <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12L9 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12L9 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_4907_2321">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
