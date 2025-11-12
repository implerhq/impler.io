import { IconType } from '@types';
import { IconSizes } from 'config';

export const ViewTransactionIcon = ({ size = 'lg' }: IconType) => {
  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_6661_1554)">
        <path
          d="M7.49935 4.16602H5.83268C5.39065 4.16602 4.96673 4.34161 4.65417 4.65417C4.34161 4.96673 4.16602 5.39065 4.16602 5.83268V15.8327C4.16602 16.2747 4.34161 16.6986 4.65417 17.0112C4.96673 17.3238 5.39065 17.4993 5.83268 17.4993H14.166C14.608 17.4993 15.032 17.3238 15.3445 17.0112C15.6571 16.6986 15.8327 16.2747 15.8327 15.8327V5.83268C15.8327 5.39065 15.6571 4.96673 15.3445 4.65417C15.032 4.34161 14.608 4.16602 14.166 4.16602H12.4993"
          stroke="#8E8E8E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 4.16667C7.5 3.72464 7.6756 3.30072 7.98816 2.98816C8.30072 2.67559 8.72464 2.5 9.16667 2.5H10.8333C11.2754 2.5 11.6993 2.67559 12.0118 2.98816C12.3244 3.30072 12.5 3.72464 12.5 4.16667C12.5 4.60869 12.3244 5.03262 12.0118 5.34518C11.6993 5.65774 11.2754 5.83333 10.8333 5.83333H9.16667C8.72464 5.83333 8.30072 5.65774 7.98816 5.34518C7.6756 5.03262 7.5 4.60869 7.5 4.16667Z"
          stroke="#8E8E8E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7.5 11.666H7.51" stroke="#8E8E8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M10 13.3327L10.8333 14.166L13.3333 11.666"
          stroke="#8E8E8E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_6661_1554">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
