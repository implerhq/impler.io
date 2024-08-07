import { IIcon } from '@types';

export function ImageIcon(props: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -4 24 24"
      width="28"
      fill="currentColor"
      className={props?.className}
      style={props?.styles}
    >
      {/* eslint-disable-next-line max-len */}
      <path d="M18 8.503V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3.504l4.39-7.322a3 3 0 0 1 4.69-.582L18 8.503zm0 2.823l-3.828-3.814a1 1 0 0 0-1.563.195L8.836 14H17a1 1 0 0 0 1-1v-1.674zM3 0h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm3 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  );
}
