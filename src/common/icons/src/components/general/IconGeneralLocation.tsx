import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralLocation = (props: SVGProps<SVGSVGElement>) => (
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
      d="M122.66 45.69c-32.41 0-58.71 26.29-58.71 58.71 0 44.03 58.71 109.02 58.71 109.02s58.71-65 58.71-109.02c0-32.41-26.29-58.71-58.71-58.71m0 79.67c-11.57 0-20.97-9.39-20.97-20.97s9.39-20.97 20.97-20.97 20.97 9.39 20.97 20.97-9.39 20.97-20.97 20.97"
    />
  </svg>
);
export default SvgIconGeneralLocation;
