import { IconType } from '@types';
import { IconSizes } from 'config';

export const CheckIcon = ({ size = 'sm', color }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={IconSizes[size]}
      height={IconSizes[size]}
      color={color}
    >
      <path
        d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z"
        fill="currentColor"
      />
    </svg>
  );
};
