import { IconType } from '@types';
import { IconSizes } from 'config';

export const ExitIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg
      fill="#E84643"
      height={IconSizes[size]}
      width={IconSizes[size]}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      stroke="#E84643"
    >
      <path d="m6 30h12a2.0023 2.0023 0 0 0 2-2v-3h-2v3h-12v-24h12v3h2v-3a2.0023 2.0023 0 0 0 -2-2h-12a2.0023 2.0023 0 0 0 -2 2v24a2.0023 2.0023 0 0 0 2 2z" />
      <path d="m20.586 20.586 3.586-3.586h-14.172v-2h14.172l-3.586-3.586 1.414-1.414 6 6-6 6z" />
    </svg>
  );
};
