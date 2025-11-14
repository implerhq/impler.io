import { IconType } from '@types';
import { IconSizes } from 'config';

export const TeamIcon = ({ size = 'xl', color = 'currentColor', className }: IconType) => {
  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M28.4072 10.5H30C31.6569 10.5 33 11.8431 33 13.5V19.5C33 21.1569 31.6569 22.5 30 22.5H28.4072C27.669 28.4195 22.6194 33 16.5 33V30C21.4706 30 25.5 25.9706 25.5 21V12C25.5 7.02944 21.4706 3 16.5 3C11.5294 3 7.5 7.02944 7.5 12V22.5H3C1.34314 22.5 0 21.1569 0 19.5V13.5C0 11.8431 1.34314 10.5 3 10.5H4.59284C5.33099 4.58053 10.3806 0 16.5 0C22.6194 0 27.669 4.58053 28.4072 10.5ZM3 13.5V19.5H4.5V13.5H3ZM28.5 13.5V19.5H30V13.5H28.5ZM10.1392 22.1773L11.7294 19.6331C13.1124 20.4993 14.7477 21 16.5 21C18.2523 21 19.8876 20.4993 21.2706 19.6331L22.8609 22.1773C21.0168 23.3323 18.8364 24 16.5 24C14.1636 24 11.9832 23.3323 10.1392 22.1773Z"
        fill={color}
      />
    </svg>
  );
};
