import { IIcon } from '@types';

export function Warning(props: IIcon) {
  const { className, styles, fill } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -2 24 24"
      width="24"
      fill={fill || '#E40000'}
      className={className}
      style={styles}
    >
      {/* eslint-disable-next-line max-len */}
      <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-13a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
    </svg>
  );
}
