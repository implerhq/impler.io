import { IconType } from '@types';
import { IconSizes } from 'config';

export const ImporterIcon = ({ size = 'xl', color = 'currentColor', className }: IconType) => {
  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 30 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M30 1.5C30 0.67158 29.3284 0 28.5 0H1.5C0.67158 0 0 0.67158 0 1.5V25.5C0 26.3284 0.67158 27 1.5 27H28.5C29.3284 27 30 26.3284 30 25.5V1.5ZM3 18H8.12406C9.2814 20.6488 11.9245 22.5 15 22.5C18.0754 22.5 20.7186 20.6488 21.876 18H27V24H3V18ZM3 3H27V15H19.5C19.5 17.4853 17.4853 19.5 15 19.5C12.5147 19.5 10.5 17.4853 10.5 15H3V3ZM21 9H16.5V4.5H13.5V9H9L15 15.75L21 9Z"
        fill={color}
      />
    </svg>
  );
};
