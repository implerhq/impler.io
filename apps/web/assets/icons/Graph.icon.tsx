import { IconType } from '@types';
import { IconSizes } from 'config';

export const GraphIcon = ({ size = 'sm', color, className }: IconType) => {
  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      color={color}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 18H17C17.2652 18 17.5196 18.1054 17.7071 18.2929C17.8946 18.4804 18 18.7348 18 19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H3C2.73478 20 2.48043 19.8946 2.29289 19.7071C2.10536 19.5196 2 19.2652 2 19C2 18.7348 2.10536 18.4804 2.29289 18.2929C2.48043 18.1054 2.73478 18 3 18ZM6 16C5.44772 16 5 15.5523 5 15V9C5 8.44772 5.44772 8 6 8H8C8.55228 8 9 8.44772 9 9V15C9 15.5523 8.55228 16 8 16H6ZM11 16C10.4477 16 10 15.5523 10 15V5C10 4.44772 10.4477 4 11 4H13C13.5523 4 14 4.44772 14 5V15C14 15.5523 13.5523 16 13 16H11ZM16 16C15.4477 16 15 15.5523 15 15V1C15 0.447715 15.4477 0 16 0H18C18.5523 0 19 0.447715 19 1V15C19 15.5523 18.5523 16 18 16H16Z"
        fill="currentColor"
      />
    </svg>
  );
};
