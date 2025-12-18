import * as React from 'react';
import type { SVGProps } from 'react';
const SvgIconGeneralPlus = (props: SVGProps<SVGSVGElement>) => (
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
      d="M123.42 45.71v158.57M202.7 124.99H44.13"
    />
  </svg>
);
export default SvgIconGeneralPlus;
