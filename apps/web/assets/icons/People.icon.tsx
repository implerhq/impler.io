import { IconType } from '@types';
import { IconSizes } from 'config';

export const PeopleIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -1.5 24 24"
      fill="currentColor"
      width={IconSizes[size]}
      height={IconSizes[size]}
    >
      <path d="M3.534 11.07a1 1 0 1 1 .733 1.86A3.579 3.579 0 0 0 2 16.26V18a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1.647a3.658 3.658 0 0 0-2.356-3.419 1 1 0 1 1 .712-1.868A5.658 5.658 0 0 1 14 16.353V18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-1.74a5.579 5.579 0 0 1 3.534-5.19zM7 1a4 4 0 0 1 4 4v2a4 4 0 1 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zm9 17a1 1 0 0 1 0-2h1a1 1 0 0 0 1-1v-1.838a3.387 3.387 0 0 0-2.316-3.213 1 1 0 1 1 .632-1.898A5.387 5.387 0 0 1 20 15.162V17a3 3 0 0 1-3 3h-1zM13 2a1 1 0 0 1 0-2 4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 1 1 0 0 1 0-2 2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
    </svg>
  );
};
