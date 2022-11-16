import { IIcon } from '@types';

export function GreenCheck(props: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18.707"
      height="13.457"
      viewBox="0 0 18.707 13.457"
      fill="currentColor"
      className={props?.className}
      style={props?.styles}
    >
      <path
        d="M10.386,15.729l9.749-9.75,1.5,1.5-11.25,11.25-6.75-6.75,1.5-1.5Z"
        transform="translate(-3.282 -5.625)"
        fill="#199c4d"
        stroke="#199c4d"
        strokeWidth="0.5"
      />
    </svg>
  );
}
