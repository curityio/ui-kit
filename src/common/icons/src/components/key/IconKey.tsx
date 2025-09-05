import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconKey = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <circle
      cx={107.8}
      cy={83.76}
      r={16.14}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={11.12}
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={11.12}
      d="M109.16 133.56c-25.53 0-47.51-23.2-47.51-48.73s20.69-46.22 46.22-46.22 46.22 20.69 46.22 46.22c0 6.38-2.92 17.52-5.26 23.05l-.36.56 18.33 28.72-4.28 19.36 19.36 4.28-4.28 19.36 16.74 3.7-4.51 32.85-32.27-7.13-48.65-76.24"
    />
  </svg>
);
export default SvgIconKey;
