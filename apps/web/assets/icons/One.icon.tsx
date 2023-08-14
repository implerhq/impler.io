import { IconType } from '@types';
import { IconSizes } from 'config';

export const OneIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={IconSizes[size]} height={IconSizes[size]}>
      <path d="M14 1.5V22H12V3.704L7.5 4.91V2.839L12.5 1.5H14Z" />
    </svg>
  );
};
