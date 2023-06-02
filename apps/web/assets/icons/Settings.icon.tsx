import { IconType } from '@types';
import { IconSizes } from 'config';

export const SettingsIcon = ({ size = 'sm' }: IconType) => {
  return (
    <svg
      width={IconSizes[size]}
      height={IconSizes[size]}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.4845 4.51648C16.6458 4.83904 16.807 5.24233 16.9684 5.64563C17.049 5.80698 16.9684 6.04893 16.807 6.12954C16.1619 6.69404 15.7586 7.58111 15.7586 8.46831C15.7586 9.35551 16.1619 10.2426 16.7264 10.8072C16.8878 10.9686 16.8878 11.1298 16.8878 11.2911C16.7264 11.6944 16.6458 12.017 16.4039 12.4203C16.3233 12.5816 16.1619 12.6622 15.92 12.6622C15.0328 12.6622 14.2263 12.9848 13.5811 13.63C12.9358 14.2753 12.6132 15.1624 12.6132 15.969C12.6132 16.1303 12.5326 16.2915 12.3713 16.4529C12.0487 16.6142 11.6454 16.7754 11.2421 16.9368C11.0808 17.0174 10.8388 16.9368 10.7582 16.7754C10.2743 16.1302 9.38727 15.7269 8.50007 15.7269C7.61287 15.7269 6.7258 16.1302 6.16116 16.7753C5.99981 16.9366 5.8386 16.9366 5.67725 16.9366C5.27395 16.7753 4.9514 16.6947 4.5481 16.4527C4.38675 16.3721 4.30615 16.2108 4.30615 15.9688C4.30615 15.0816 3.98359 14.2752 3.33834 13.6299C2.69309 12.9847 1.80602 12.6621 0.999426 12.6621C0.838079 12.6621 0.67687 12.5815 0.515522 12.4201C0.354175 12.0976 0.192966 11.6943 0.0316189 11.291C-0.0489856 11.1296 0.0316189 10.8877 0.192966 10.8071C0.838217 10.2426 1.24152 9.35551 1.24152 8.46831C1.24152 7.58111 0.838217 6.69404 0.193104 6.1294C0.112365 5.96819 0.0317571 5.80684 0.112365 5.64549C0.193104 5.24233 0.354317 4.91964 0.515664 4.51648C0.596269 4.35513 0.757616 4.27453 0.999568 4.27453C1.88677 4.27453 2.69323 3.95197 3.33848 3.30672C3.98373 2.66147 4.30629 1.77441 4.30629 0.967807C4.30629 0.80646 4.38689 0.645251 4.54824 0.483904C4.8708 0.322556 5.27409 0.161347 5.67726 0.0806045C5.8386 2.47225e-08 6.08055 0.0806045 6.16116 0.241952C6.72581 0.80646 7.61287 1.20976 8.50007 1.20976C9.38728 1.20976 10.2743 0.80646 10.839 0.161347C11.0003 -3.29633e-08 11.1615 0 11.3229 0C11.7262 0.161347 12.0487 0.241952 12.452 0.483904C12.6134 0.564508 12.694 0.725855 12.694 0.967807C12.694 1.85501 13.0166 2.66147 13.6618 3.30672C14.3071 3.95197 15.1941 4.27453 16.0007 4.27453C16.1619 4.27453 16.4039 4.35513 16.4845 4.51648ZM8.50007 14.1137C11.6454 14.1137 14.1455 11.6135 14.1455 8.46824C14.1455 5.32294 11.6454 2.82282 8.50007 2.82282C5.35477 2.82282 2.85464 5.32294 2.85464 8.46824C2.85464 11.6135 5.35477 14.1137 8.50007 14.1137ZM8.50007 11.6942C6.7258 11.6942 5.27409 10.2424 5.27409 8.46817C5.27409 6.69391 6.7258 5.2422 8.50007 5.2422C10.2743 5.2422 11.726 6.69391 11.726 8.46817C11.726 10.2424 10.2743 11.6942 8.50007 11.6942ZM8.50007 10.0812C9.38727 10.0812 10.1131 9.35538 10.1131 8.46817C10.1131 7.58097 9.38727 6.85512 8.50007 6.85512C7.61287 6.85512 6.88701 7.58097 6.88701 8.46817C6.88701 9.35538 7.61287 10.0812 8.50007 10.0812Z"
        fill="currentColor"
      />
      <path d="M8 6.641l1.121-1.12a1 1 0 0 1 1.415 1.413L7.707 9.763a.997.997 0 0 1-1.414 0L3.464 6.934A1 1 0 1 1 4.88 5.52L6 6.641V1a1 1 0 1 1 2 0v5.641zM1 12h12a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2z" />
    </svg>
  );
};
