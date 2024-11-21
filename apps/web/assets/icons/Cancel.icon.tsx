import { IconType } from '@types';
import { IconSizes } from 'config';

export const CancelIcon = ({ size = 'sm', color }: IconType) => {
  return (
    <svg
      height={IconSizes[size]}
      width={IconSizes[size]}
      color={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -2 24 24"
      fill="currentColor"
    >
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path>
      <path
        d="M11.414 10l2.829 2.828a1 1 0 0 1-1.415 1.415L10 11.414l-2.828 2.829a1 1 0 1 1-1.415-1.415L8.586 10 5.757 7.172a1 1 0 0 1 1.415-1.415L10 8.586l2.828-2.829a1 1 0 0 1 1.415 1.415L11.414 10z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
