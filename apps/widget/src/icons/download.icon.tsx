import { IIcon } from '@types';

export function Download(props: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={props?.className}
      style={props?.styles}
    >
      <path d="M0,0H24V24H0Z" fill="none" />
      <path
        d="M3,19H21v2H3Zm10-5.828L19.071,7.1l1.414,1.414L12,17,3.515,8.515,4.929,7.1,11,13.17V2h2Z"
        fill={props?.fill || '#24a0ed'}
      />
    </svg>
  );
}
