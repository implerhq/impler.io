import { IconType } from '@types';
import { IconSizes } from 'config';

export const ChevronUpIcon = ({ size = 'sm', color }: IconType) => {
  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      color={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.9997 10.8284L7.04996 15.7782L5.63574 14.364L11.9997 8L18.3637 14.364L16.9495 15.7782L11.9997 10.8284Z" />
    </svg>
  );
};
