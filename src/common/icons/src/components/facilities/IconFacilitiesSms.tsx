import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconFacilitiesSms = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || `100%`}
    height={props.height || `100%`}
    stroke="currentColor"
    fill="none"
    {...props}
  >
    <circle cx={125.74} cy={198.14} r={7.49} fill={props.color || `currentColor`} />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={10.38}
      d="M118.25 55.98h14.97M80.56 61.72V47.28c0-5.17 4.23-9.41 9.41-9.41h76.06c5.17 0 9.41 4.23 9.41 9.41v161.45"
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={10.38}
      d="M175.44 198.14v10.58c0 5.17-4.23 9.41-9.41 9.41H89.97c-5.17 0-9.41-4.23-9.41-9.41V61.7"
    />
  </svg>
);
export default SvgIconFacilitiesSms;
