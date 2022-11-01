import { IIcon } from '@types';

export function ChevronDown(props: IIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      width="14.993"
      height="8.574"
      viewBox="0 0 14.993 8.574"
      className={props?.className}
      style={props?.styles}
    >
      <path
        // eslint-disable-next-line max-len
        d="M.207,14.2a.69.69,0,0,1-.068-.907l.068-.078L6.3,7.2.207,1.189A.69.69,0,0,1,.138.282L.207.2A.713.713,0,0,1,1.126.137L1.205.2l6.588,6.5a.69.69,0,0,1,.068.907l-.068.078L1.205,14.2A.712.712,0,0,1,.207,14.2Z"
        transform="translate(14.707 0.287) rotate(90)"
        fill="#999"
        stroke="#999"
        stroke-width="0.5"
      />
    </svg>
  );
}
