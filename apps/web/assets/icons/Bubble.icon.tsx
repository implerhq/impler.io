import { IconType } from '@types';
import { IconSizes } from 'config';

export const BubbleIcon = ({ size = 'lg' }: IconType) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={IconSizes[size]} height={IconSizes[size]} fill="none">
      <g clipPath="url(#a)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M13.5415 7.97067C11.994 7.97067 10.4688 8.63503 9.30432 9.94119V3.5H7V14.3441C7 14.3444 7 14.3447 7 14.345C7 17.8653 9.85382 20.7192 13.3742 20.7192C16.8946 20.7192 19.7485 17.8653 19.7485 14.345C19.7485 10.8246 17.0619 7.97067 13.5415 7.97067ZM13.3742 18.264C11.2098 18.264 9.45507 16.5094 9.45507 14.3449C9.45507 12.1804 11.2098 10.4257 13.3742 10.4257C15.5387 10.4257 17.2934 12.1804 17.2934 14.3449C17.2934 16.5094 15.5387 18.264 13.3742 18.264Z"
          fill="currentColor"
        />
        <path
          d="M5.32625 17.5664C4.45569 17.5664 3.75 18.2721 3.75 19.1427C3.75 20.0132 4.45569 20.7189 5.32625 20.7189C6.19681 20.7189 6.90249 20.0132 6.90249 19.1427C6.90249 18.2721 6.19681 17.5664 5.32625 17.5664Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_4865_2964">
          <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
        </clipPath>
        <clipPath id="clip1_4865_2964">
          <rect width="16" height="17.25" fill="white" transform="translate(3.75 3.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};
