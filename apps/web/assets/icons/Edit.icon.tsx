import { IconType } from '@types';
import { IconSizes } from 'config';

export const EditIcon = ({ size = 'sm', color, style }: IconType) => {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={IconSizes[size]}
      height={IconSizes[size]}
      color={color}
    >
      <path
        d="M6.41421 15.89L16.5563 5.74786L15.1421 4.33365L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6474L14.435 2.21233C14.8256 1.8218 15.4587 1.8218 15.8492 2.21233L18.6777 5.04075C19.0682 5.43128 19.0682 6.06444 18.6777 6.45497L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
