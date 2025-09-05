import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralCheckmarkCircled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={14}
      d="M196.14 121.77v6.27c-.02 37.63-30.55 68.12-68.18 68.1s-68.12-30.55-68.1-68.18 30.55-68.12 68.18-68.1c9.54 0 18.98 2.02 27.69 5.9"
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={14}
      d="M107.56 121.22 128 141.66l68.14-68.14"
    />
  </svg>
);
export default SvgIconGeneralCheckmarkCircled;
