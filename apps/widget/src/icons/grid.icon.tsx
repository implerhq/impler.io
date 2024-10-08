import { IIcon } from '@types';

export function GridIcon(props: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-5 -5 24 24"
      width="28"
      fill="currentColor"
      className={props?.className}
      style={props?.styles}
    >
      {/* eslint-disable-next-line max-len */}
      <path d="M2,6 L6,6 L6,2 L2,2 L2,6 Z M2,8 L2,12 L6,12 L6,8 L2,8 Z M12,6 L12,2 L8,2 L8,6 L12,6 Z M12,8 L8,8 L8,12 L12,12 L12,8 Z M2,0 L12,0 C13.1045695,0 14,0.8954305 14,2 L14,12 C14,13.1045695 13.1045695,14 12,14 L2,14 C0.8954305,14 0,13.1045695 0,12 L0,2 C0,0.8954305 0.8954305,0 2,0 Z" />
    </svg>
  );
}
