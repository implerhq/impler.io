import { IconType } from '@types';
import { IconSizes } from 'config';

export const AngularIcon = ({ size = 'lg' }: IconType) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={IconSizes[size]} height={IconSizes[size]} fill="none">
    <g clipPath="url(#a)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.42872 17.7454L11.5047 21.2164C11.6558 21.3027 11.8267 21.3481 12.0007 21.3481C12.1747 21.3481 12.3457 21.3027 12.4967 21.2164L18.5727 17.7454C18.706 17.6693 18.82 17.5635 18.9059 17.4362C18.9917 17.3089 19.0471 17.1636 19.0677 17.0114L20.3907 7.30744C20.4218 7.07949 20.3733 6.84779 20.2534 6.65142C20.1336 6.45505 19.9497 6.30602 19.7327 6.22944L12.3327 3.61744C12.1175 3.54158 11.8829 3.54158 11.6677 3.61744L4.26872 6.23044C4.05178 6.30702 3.86787 6.45605 3.74801 6.65242C3.62815 6.84879 3.57966 7.08049 3.61072 7.30844L4.93372 17.0124C4.95435 17.1646 5.00973 17.3099 5.09557 17.4372C5.18141 17.5645 5.2954 17.6693 5.42872 17.7454Z" />
      <path d="M9 15.5L12 7.5L15 15.5" />
      <path d="M10 13.5H14" />
    </g>
    <defs>
      <clipPath id="clip0_4865_2955">
        <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
);
