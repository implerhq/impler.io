import { IconType } from '@types';
import { IconSizes } from 'config';

export const JavaScriptIcon = ({ size = 'lg', color = '#fff' }: IconType) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={IconSizes[size]} height={IconSizes[size]} fill="none">
      <g clipPath="url(#a)" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4.5 18 19l-6 2-6-2L4 4.5h16Z" />
        <path d="M7.5 8.5h3v8l-2-1M16.5 8.5H14c-.1326 0-.2598.05268-.3536.14645-.0937.09376-.1464.22094-.1464.35355v3c0 .1326.0527.2598.1464.3536.0938.0937.221.1464.3536.1464h1.423c.0716 0 .1423.0154.2074.0451.0651.0297.1231.073.17.1271.047.054.0817.1175.102.1861s.0256.1408.0156.2117L15.5 16l-2 .5" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill={color} transform="translate(0 .5)" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};
