import { IconType } from '@types';
import { IconSizes } from 'config';

export const LockIcon = ({ size = 'sm', color, className }: IconType) => {
  return (
    <svg
      color={color}
      fill="currentColor"
      viewBox="-5 -2 24 24"
      className={className}
      width={IconSizes[size]}
      height={IconSizes[size]}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2V5a5 5 0 1 1 10 0v5zm-5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-7V5a3 3 0 1 0-6 0v5h6z" />
    </svg>
  );
};
