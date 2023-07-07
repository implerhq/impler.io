import { IconType } from '@types';
import { IconSizes } from 'config';

export const AddIcon = ({ size = 'sm', color }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={IconSizes[size]}
      height={IconSizes[size]}
      color={color}
    >
      <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill="currentColor" />
    </svg>
  );
};
