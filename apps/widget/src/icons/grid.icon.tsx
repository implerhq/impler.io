import { IIcon } from '@types';

export function GridIcon(props: IIcon) {
  return (
    <svg
      width="21"
      height="22"
      viewBox="0 0 21 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props?.className}
      style={props?.styles}
    >
      <g clipPath="url(#clip0_4259_5403)">
        <path
          d="M2.625 4.875C2.625 4.41087 2.80937 3.96575 3.13756 3.63756C3.46575 3.30937 3.91087 3.125 4.375 3.125H16.625C17.0891 3.125 17.5342 3.30937 17.8624 3.63756C18.1906 3.96575 18.375 4.41087 18.375 4.875V17.125C18.375 17.5891 18.1906 18.0342 17.8624 18.3624C17.5342 18.6906 17.0891 18.875 16.625 18.875H4.375C3.91087 18.875 3.46575 18.6906 3.13756 18.3624C2.80937 18.0342 2.625 17.5891 2.625 17.125V4.875Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="2"
          d="M2.625 9.25H18.375"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="2"
          d="M8.75 3.125V18.875"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4259_5403">
          <rect width="21" height="21" fill="currentColor" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}
