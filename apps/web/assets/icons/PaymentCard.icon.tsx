import { IconType } from '@types';
import { IconSizes } from 'config';

export const PaymentCardIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_6661_1564)">
        <path
          d="M2.5 6.66602C2.5 6.00297 2.76339 5.36709 3.23223 4.89825C3.70107 4.42941 4.33696 4.16602 5 4.16602H15C15.663 4.16602 16.2989 4.42941 16.7678 4.89825C17.2366 5.36709 17.5 6.00297 17.5 6.66602V13.3327C17.5 13.9957 17.2366 14.6316 16.7678 15.1005C16.2989 15.5693 15.663 15.8327 15 15.8327H5C4.33696 15.8327 3.70107 15.5693 3.23223 15.1005C2.76339 14.6316 2.5 13.9957 2.5 13.3327V6.66602Z"
          stroke="#8E8E8E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M2.5 8.33398H17.5" stroke="#8E8E8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.83398 12.5H5.84398" stroke="#8E8E8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.16602 12.5H10.8327" stroke="#8E8E8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_6661_1564">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
